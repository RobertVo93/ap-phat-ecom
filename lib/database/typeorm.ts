import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config();
import { CollectionEntity } from "./entities/collection.entity";
import { ProductEntity } from "./entities/product.entity";
import { env } from "@/constants/env";
import { CartEntity, CartItemEntity } from "./entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: env.NODE_ENV === "development", // set to false in production and use migrations
  logging: false,
  entities: [
    ProductEntity,
    CollectionEntity,
    CartEntity,
    CartItemEntity,
  ],
  ssl: { rejectUnauthorized: false }, // required for Neon
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});