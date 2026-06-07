import { CustomerEntity } from "@/lib/database/entities/customer.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { AppDataSource } from "@/lib/database/typeorm";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CustomerStatus, CustomerType, UserRole } from "@/types"
import { IUser } from "@/types/user.interface";
import { compare, genSalt, hash } from "bcryptjs";
import { removeEmptyProperties } from "../utils";

export class UserService {
  private userRepository = AppDataSource.getRepository(UserEntity);

  async getCurrentUser(userId: string): Promise<IUser | null> {
    const repo = AppDataSource.getRepository(UserEntity);
    const user = await repo.findOne({
        where: { id: userId },
        relations: ["customer"],
      });
    return user
  }

  async createUser(userId: string, fullName: string, email: string, phone: string, username: string, password: string): Promise<IUser> {
    return await AppDataSource.transaction(async (manager) => {
      const existingUsernameOwner = await manager.findOne(UserEntity, {
        where: { username },
      });

      if (existingUsernameOwner && existingUsernameOwner.id !== userId) {
        throw new Error("USER_WITH_USERNAME_EXISTS");
      }

      const salt = await genSalt(10)
      const hashed = await hash(password, salt)

      // 1. create or upgrade user
      const existingUser = await manager.findOne(UserEntity, {
        where: { id: userId },
        relations: ["customer"],
      });
      const newUserObj = {
        id: userId,
        fullName,
        email,
        username,
        phone,
        password: hashed,
        passwordSalt: salt,
        role: UserRole.customer,
        active: true,
        lastLogin: new Date(),
      }

      const user = manager.create(UserEntity, {
        ...(existingUser || {}),
        ...removeEmptyProperties(newUserObj)
      });
      const savedUser = await manager.save(UserEntity, user);

      // 2. create or update customer with the same id as user
      const existingCustomer = existingUser?.customer || await manager.findOne(CustomerEntity, {
        where: { id: userId },
      });

      const customer = manager.create(CustomerEntity, {
        ...(existingCustomer || {}),
        id: userId,
        name: savedUser.fullName || "",
        email: savedUser.email,
        phone: savedUser.phone,
        joinDate: existingCustomer?.joinDate || new Date(),
        customerType: CustomerType.regular,
        status: CustomerStatus.active,
        user: savedUser
      });
      await manager.save(CustomerEntity, customer);

      const result = await manager.findOneOrFail(UserEntity, {
        where: { id: savedUser.id },
        relations: ["customer"],
      });

      return result;
    })
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.password) {
      throw new Error("PASSWORD_LOGIN_NOT_AVAILABLE");
    }

    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error("INVALID_CURRENT_PASSWORD");
    }

    const salt = await genSalt(10);
    user.password = await hash(newPassword, salt);
    user.passwordSalt = salt;

    await this.userRepository.save(user);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    await ensureDataSource();
    return await this.userRepository.findOneBy({ username });
  }

  async getUserStats(userId: string) {
    const orderRepo = AppDataSource.getRepository(OrderEntity);
    const [recentOrders, rawStats] = await Promise.all([
      // get 4 newest orders
      orderRepo.find({
        where: {
          customer: {
            user: {
              id: userId,
            },
          },
        },
        order: {
          createdAt: "DESC",
        },
        take: 4,
      }),

      // get stats
      orderRepo
        .createQueryBuilder("order")
        .leftJoin("order.customer", "customer")
        .leftJoin("customer.user", "user")
        .select("COUNT(order.id)", "totalOrders")
        .addSelect("SUM(order.totalAmount)", "totalSpent")
        .addSelect("COUNT(DISTINCT order.shippingAddress)", "totalAddresses")
        .where("user.id = :userId", { userId })
        .getRawOne(),
    ]);

    return {
      stats: {
        totalOrders: Number(rawStats?.totalOrders || 0),
        totalSpent: Number(rawStats?.totalSpent || 0),
        totalAddresses: Number(rawStats?.totalAddresses || 0),
      },
      recentOrders: recentOrders,
    };
  }
}
