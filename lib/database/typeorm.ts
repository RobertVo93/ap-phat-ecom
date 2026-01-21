import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();
import { CollectionEntity } from "./entities/collection.entity";
import { ProductEntity } from "./entities/product.entity";
import { env } from "@/constants/env";
import { AddressEntity, CartEntity, CartItemEntity, UserEntity } from "./entities";
import { OrderEntity } from "./entities/order.entity";
import { CustomerEntity } from "./entities/customer.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: false, // set to false in production and use migrations
  logging: false,
  entities: [
    ProductEntity,
    CollectionEntity,
    CartEntity,
    CartItemEntity,
    UserEntity,
    OrderEntity,
    CustomerEntity,
    AddressEntity,
  ],
  ssl: { rejectUnauthorized: false }, // required for Neon
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});