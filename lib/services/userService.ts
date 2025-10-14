import { UserEntity } from "../database/entities";
import { AppDataSource } from "../database/typeorm";
import { UserRole } from "@/types"
import { hash, genSalt } from "bcryptjs"

export async function getCurrentUser(userId: string) {
  const repo = AppDataSource.getRepository(UserEntity);
  const user = await repo.findOne({ where: { id: userId } });
  return user
}

export async function createNewUser(
  email: string, phone: string, username: string, password: string
) {
  const repo = AppDataSource.getRepository(UserEntity)

  const existing = await repo.findOne({ where: [{ phone: phone }] })
  if (existing) return

  const salt = await genSalt(10)
  const hashed = await hash(password, salt)

  // create new user
  const user = repo.create({
    email: email,
    username: username,
    phone: phone,
    password: hashed,
    passwordSalt: salt,
    role: UserRole.customer,
    active: true,
    lastLogin: new Date(),
  })

  return await repo.save(user)
}