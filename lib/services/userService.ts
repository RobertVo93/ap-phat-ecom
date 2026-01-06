import { CustomerEntity } from "@/lib/database/entities/customer.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { AppDataSource } from "@/lib/database/typeorm";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CustomerStatus, CustomerType, UserRole } from "@/types"
import { IUser } from "@/types/user.interface";
import { hash, genSalt } from "bcryptjs";

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

  async createUser(userId: string, customerId: string, fullName: string, email: string, phone: string, username: string, password: string): Promise<IUser> {
    return await AppDataSource.transaction(async (manager) => {
      const salt = await genSalt(10)
      const hashed = await hash(password, salt)

      // 1. create new user
      const user = manager.create(UserEntity, {
        id: userId,
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
        id: customerId,
        name: savedUser.fullName || "",
        email: savedUser.email,
        phone: savedUser.phone,
        joinDate: new Date(),
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


