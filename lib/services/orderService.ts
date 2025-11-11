import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { IOrder } from "@/types";
import { CustomerEntity } from "../database/entities/customer.entity";

export async function createOrderService(data: Partial<IOrder>, phone: string, email: string) {
  const orderRepo = AppDataSource.getRepository(OrderEntity);
  const customerRepo = AppDataSource.getRepository(CustomerEntity)

  // 1. find customer of current user by email and phone
  const customer = await customerRepo.findOne({ where: [{ email: email }, { phone: phone }] })
  if(!customer) return null

  // 2. create order
  const order = orderRepo.create({
    ...data,
    customer: customer
  })

  return await orderRepo.save(order);
}
