import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { CustomerStatus, CustomerType, IOrder, NotificationType, OrderStatus, UserRole } from "@/types";
import { CustomerEntity } from "../database/entities/customer.entity";
import { NotificationEntity } from "../database/entities/notification.entity";
import { notificationEmitter } from "../eventEmitter";
import { NotificationSettingsEntity, UserEntity } from "../database/entities";
import { v4 as uuidv4 } from 'uuid';
import { EntityManager } from "typeorm";

export async function createOrderForGuest(data: Partial<IOrder>) {
  return createOrderWithCustomer(data, (manager) => resolveGuestCustomer(manager, data));
}

export async function createOrderForAuthenticatedUser(data: Partial<IOrder>, userId: string) {
  return createOrderWithCustomer(data, (manager) => resolveAuthenticatedCustomer(manager, data, userId));
}

async function createOrderWithCustomer(
  data: Partial<IOrder>,
  resolveCustomer: (manager: EntityManager) => Promise<CustomerEntity>
) {
  const transactionResult = await AppDataSource.transaction(async (manager) => {
    console.log("[orderService.createOrderWithCustomer]-data", data)
    const customer = await resolveCustomer(manager);
    console.log("[orderService.createOrderWithCustomer]Step0-customer", customer)
    const warehouseId = await getPrimaryWarehouseId(manager);

    // 1. create order
    const order = manager.create(OrderEntity, {
      ...data,
      customer,
      warehouseId,
    });
    const savedOrder = await manager.save(OrderEntity, order);
    console.log("[orderService.createOrderWithCustomer]Step1-savedOrder", savedOrder)

    // 2. notification settings
    const settings = await manager.findOne(NotificationSettingsEntity, {
      where: { user: { id: customer.user?.id } }
    });
    console.log("[orderService.createOrderWithCustomer]Step2-settings", settings)

    // 3. create notification (dedup safe)
    let savedNotification: NotificationEntity | null = null;
    if (settings?.orderEnabled && settings?.inappEnabled) {
      const deduplicationKey = `order:${savedOrder.id}`;

      try {
        const notification = manager.create(NotificationEntity, {
          type: NotificationType.order,
          title: "orderCreatedTitle",
          content: "orderCreatedContent",
          userId: customer.user?.id,
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
    console.log("[orderService.createOrderWithCustomer]Step3-savedNotification", savedNotification)


    return {
      order: savedOrder,
      notification: savedNotification,
      userId: customer.user?.id,
      settings
    };
  });

  // 4. realtime trigger
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

async function getPrimaryWarehouseId(manager: EntityManager): Promise<string> {
  const warehouses: Array<{ id: string }> = await manager.query(
    `SELECT "id" FROM "warehouses" WHERE "main" = $1 ORDER BY "created_at" ASC LIMIT 1`,
    [true],
  );
  const warehouseId = warehouses[0]?.id;

  if (!warehouseId) {
    throw new Error("Primary warehouse not found");
  }

  return warehouseId;
}

async function resolveGuestCustomer(manager: EntityManager, data: Partial<IOrder>) {
  let customerId = data.customer?.id;

  if (customerId) {
    const customer = await manager.findOne(CustomerEntity, {
      where: { id: customerId },
      relations: ['user']
    });

    if (customer) {
      return customer;
    }
  }

  customerId = customerId || uuidv4();

  const user = manager.create(UserEntity, {
    id: customerId,
    fullName: data.receiverInfo?.name as string,
    email: '',
    username: `guest-${customerId}`,
    phone: data.receiverInfo?.phone,
    password: "",
    passwordSalt: "",
    role: UserRole.customer,
    active: true,
    lastLogin: new Date(),
  });
  const savedUser = await manager.save(UserEntity, user);

  const customer = manager.create(CustomerEntity, {
    id: customerId,
    name: data.receiverInfo?.name,
    email: '',
    phone: data.receiverInfo?.phone,
    joinDate: new Date(),
    customerType: CustomerType.regular,
    status: CustomerStatus.active,
    location: data.shippingAddress,
    user: savedUser,
  });

  return manager.save(CustomerEntity, customer);
}

async function resolveAuthenticatedCustomer(manager: EntityManager, data: Partial<IOrder>, userId: string) {
  const user = await manager.findOne(UserEntity, {
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Authenticated user not found");
  }

  const customer = await manager.findOne(CustomerEntity, {
    where: { id: userId },
    relations: ['user']
  });

  if (customer) {
    return customer;
  }

  return manager.save(CustomerEntity, manager.create(CustomerEntity, {
    id: userId,
    name: user.fullName || data.receiverInfo?.name || "Khách lẻ",
    email: user.email || '',
    phone: user.phone || data.receiverInfo?.phone,
    joinDate: new Date(),
    customerType: CustomerType.regular,
    status: CustomerStatus.active,
    location: data.shippingAddress,
    user,
  }));
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

export async function getOrderByIdForUser(id: string, userId: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  return repo
    .createQueryBuilder("order")
    .innerJoin("order.customer", "customer")
    .where("order.id = :id", { id })
    .andWhere("customer.id = :userId", { userId })
    .getOne();
}

export async function cancelOrder(id: string, userId?: string) {
  const transactionResult = await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(OrderEntity);
    const orderQuery = orderRepo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.customer", "customer")
      .leftJoinAndSelect("customer.user", "user")
      .where("order.id = :id", { id });

    if (userId) {
      orderQuery.andWhere("user.id = :userId", { userId });
    }

    const order = await orderQuery.getOne();

    if (!order) {
      return null;
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

  if (!transactionResult) return null;

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
