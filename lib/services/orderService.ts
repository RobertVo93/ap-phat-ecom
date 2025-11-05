import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { IOrder } from "@/types";

export async function createOrderService(data: Partial<IOrder>) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const record = repo.create(data);
  return await repo.save(record);
}
