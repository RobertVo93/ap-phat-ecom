import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { CustomerStatus, CustomerType, IOrder, OrderStatus } from "@/types";
import { CustomerEntity } from "../database/entities/customer.entity";

export async function createOrderService(data: Partial<IOrder>) {
  return await AppDataSource.transaction(async (manager) => {
    // 1. find existed customer or create new one
    const customerId = data.customer?.id
    let customer = await manager.findOne(CustomerEntity, { where: { id: customerId } })
    if (!customer) {
      customer = manager.create(CustomerEntity, {
        id: customerId,
        name: data.receiverInfo?.name,
        email: '',
        phone: data.receiverInfo?.phone,
        joinDate: new Date(),
        customerType: CustomerType.regular,
        status: CustomerStatus.active,
      });
      customer = await manager.save(CustomerEntity, customer);
    }

    // 2. create order
    const order = manager.create(OrderEntity, {
      ...data,
      customer: customer
    })

    return await manager.save(OrderEntity, order);
  })
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
  const repo = AppDataSource.getRepository(OrderEntity);
  const order = await repo.findOne({ where: { id } })
  if (!order) {
    throw new Error("Order not found");
  }
  order.status = OrderStatus.cancelled;
  return await repo.save(order);
}
