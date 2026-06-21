import { Entity, Column, ManyToMany } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { ProductStatus, ProductUnit } from "@/types/enums";
import { 
  ICollection,
  IProduct 
} from "@/types";
import { CollectionEntity } from "./collection.entity";

@Entity({ name: "products" })
export class ProductEntity extends BaseEntity implements IProduct {
  @Column({ nullable: false })
  name?: string;

  @Column({ type: "enum", enum: ProductUnit, nullable: false })
  unit?: ProductUnit;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "float", nullable: true })
  price?: number;

  @Column({ name: "tier_prices", type: "jsonb", nullable: true })
  tierPrices?: IProduct["tierPrices"];

  @Column({ type: "float", nullable: true })
  cost?: number;

  @Column({ type: "int", nullable: true })
  stock?: number;

  @Column({ type: "int", nullable: true })
  minStock?: number;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({ type: "enum", enum: ProductStatus, nullable: true })
  status?: ProductStatus;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ nullable: true })
  image?: string;
  
  @Column({ name: "sub_images", type: "text", array: true, nullable: false, default: () => "'{}'" })
  subImages?: string[];

  //////Related fields//////
  @ManyToMany(() => CollectionEntity, (collection) => collection.products, { nullable: true })
  collections?: ICollection[];
} 
