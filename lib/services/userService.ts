import { UserEntity } from "../database/entities";
import { CustomerEntity } from "../database/entities/customer.entity";
import { AppDataSource } from "../database/typeorm";
import { CustomerStatus, CustomerType, UserRole } from "@/types"
import { hash, genSalt } from "bcryptjs"

export async function getCurrentUser(userId: string) {
  const repo = AppDataSource.getRepository(UserEntity);
  const user = await repo.findOne({ where: { id: userId } });
  return user
}

export async function createNewUser(
  fullName: string, email: string, phone: string, username: string, password: string
) {
  return await AppDataSource.transaction(async (manager) => {
    const existing = await manager.findOne(UserEntity, { where: [{ username: username }] })
    if (existing) {
      return "Username existed!"
    }

    const salt = await genSalt(10)
    const hashed = await hash(password, salt)

    // 1. create new user
    const user = manager.create(UserEntity, {
      fullName: fullName,
      email: email,
      username: username,
      phone: phone,
      password: hashed,
      passwordSalt: salt,
      role: UserRole.customer,
      active: true,
      lastLogin: new Date(),
    })
    const savedUser = await manager.save(UserEntity, user);

    // 2. create new customer
    const customer = manager.create(CustomerEntity, {
      name: savedUser.fullName || "",
      email: savedUser.email,
      phone: savedUser.phone,
      joinDate: new Date(),
      customerType: CustomerType.regular,
      status: CustomerStatus.active
    });
    await manager.save(CustomerEntity, customer);

    return savedUser
  })
}