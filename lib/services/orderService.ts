import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { CustomerStatus, CustomerType, IOrder, NotificationType, OrderStatus } from "@/types";
import { CustomerEntity } from "../database/entities/customer.entity";
import { NotificationEntity } from "../database/entities/notification.entity";
import { notificationEmitter } from "../eventEmitter";
import { NotificationSettingsEntity } from "../database/entities";

export async function createOrderService(data: Partial<IOrder>) {
  const transactionResult = await AppDataSource.transaction(async (manager) => {
    // 1. find existed customer or create new one
    const customerId = data.customer?.id
    let customer: CustomerEntity | null = null;

    if (customerId) {
      customer = await manager.findOne(CustomerEntity, {
        where: { id: customerId },
        relations: ['user']
      });
    }

    if (!customer) {
      const newCustomer = manager.create(CustomerEntity, {
        id: customerId,
        name: data.receiverInfo?.name,
        email: '',
        phone: data.receiverInfo?.phone,
        joinDate: new Date(),
        customerType: CustomerType.regular,
        status: CustomerStatus.active,
      });
      customer = await manager.save(CustomerEntity, newCustomer);
    }

    if (!customer.user) {
      throw new Error("Customer has no user attached");
    }

    // 2. create order
    const order = manager.create(OrderEntity, {
      ...data,
      customer
    });
    const savedOrder = await manager.save(OrderEntity, order);

    // 3. notification settings
    const settings = await manager.findOne(NotificationSettingsEntity, {
      where: { user: { id: customer.user.id } }
    });

    // 4. create notification (dedup safe)
    let savedNotification: NotificationEntity | null = null;
    if (settings?.orderEnabled && settings?.inappEnabled) {
      const deduplicationKey = `order:${savedOrder.id}`;

      try {
        const notification = manager.create(NotificationEntity, {
          type: NotificationType.order,
          title: "orderCreatedTitle",
          content: "orderCreatedContent",
          userId: customer.user.id,
          user: customer.user,
          isRead: false,
          deduplicationKey,
          data: {
            orderNumber: savedOrder.number,
            orderId: savedOrder.id,
            total: savedOrder.totalAmount,
            paymentMethod: savedOrder.paymentMethod
          },
          url: `/account/orders/${savedOrder.id}`
        });

        savedNotification = await manager.save(NotificationEntity, notification);
      } catch (err: any) {
        if (err.code !== '23505') { // postgres unique_violation
          throw err;
        }
      }
    }

    return {
      order: savedOrder,
      notification: savedNotification,
      userId: customer.user.id,
      settings
    };
  });

  // 5. realtime trigger
  if (
    transactionResult.notification &&
    transactionResult.userId &&
    transactionResult.settings?.inappEnabled &&
    transactionResult.settings?.orderEnabled
  ) {
    notificationEmitter.emit('new_notification', {
      userId: transactionResult.userId,
      payload: transactionResult.notification
    });
  }

  return transactionResult.order;
}

type GetOrdersInput = {
  customerId?: string;
  searchTerm?: string;
  status?: OrderStatus;
  offset?: number;
  limit?: number;
};

export async function getOrders({
  customerId,
  searchTerm,
  status,
  offset = 0,
  limit = 10,
}: GetOrdersInput) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const qb = repo.createQueryBuilder("order");

  qb.leftJoinAndSelect("order.customer", "customer");

  // Always filter by customer ID for security - users should only see their own orders
  if (customerId) {
    qb.andWhere("customer.user_id = :customerId", { customerId });
  }

  if (status) {
    qb.andWhere("order.status = :status", { status });
  }

  if (searchTerm && searchTerm.trim() !== "") {
    qb.andWhere(
      `
        (
          order.number ILIKE :searchTerm
          OR order.notes ILIKE :searchTerm
          OR order.shippingAddress ILIKE :searchTerm
          OR customer.name ILIKE :searchTerm
        )
      `,
      { searchTerm: `%${searchTerm}%` }
    );
  }

  qb.orderBy("order.deliveryDate", "DESC");

  qb.skip(offset).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    total,
    offset,
    limit,
    hasMore: offset + data.length < total,
  };
}

export async function getOrderById(id: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  return repo.findOne({
    where: { id },
  });
}

export async function cancelOrder(id: string) {
  const transactionResult = await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(OrderEntity);

    const order = await orderRepo.findOne({
      where: { id },
      relations: ["customer", "customer.user"],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // update status
    order.status = OrderStatus.cancelled;
    const savedOrder = await orderRepo.save(order);

    // create notification
    let savedNotification: NotificationEntity | null = null;
    const settings = await manager.findOne(NotificationSettingsEntity, {
      where: { user: { id: order.customer?.user?.id } }
    })
    if (order.customer?.user) {
      const notification = manager.create(NotificationEntity, {
        type: NotificationType.order,
        title: "orderCancelledTitle",
        content: "orderCancelledContent",
        user: order.customer.user,
        userId: order.customer.user.id,
        isRead: false,
        createdAt: new Date(),
        data: {
          orderNumber: savedOrder.number,
          orderId: savedOrder.id,
          total: savedOrder.totalAmount,
        },
        url: `/account/orders/${savedOrder.id}`,
      });

      savedNotification = await manager.save(NotificationEntity, notification);
    }

    return {
      order: savedOrder,
      notification: savedNotification,
      userId: order.customer?.user?.id,
      settings: settings,
    };
  });

  // realtime trigger
  if (
    transactionResult.notification &&
    transactionResult.userId &&
    transactionResult.settings?.inappEnabled &&
    transactionResult.settings?.orderEnabled
  ) {
    notificationEmitter.emit("new_notification", {
      userId: transactionResult.userId,
      payload: transactionResult.notification,
    });
  }

  return transactionResult.order;
}
