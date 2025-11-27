import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { CustomerStatus, CustomerType, IOrder } from "@/types";
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
