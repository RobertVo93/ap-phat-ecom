import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { CollectionStatus } from "@/types/enums";
import { ICollection, IProduct } from "@/types";
import { ProductEntity } from "./product.entity";

@Entity({ name: "collections" })
export class CollectionEntity extends BaseEntity implements ICollection {
  @Column({ unique: true})
  number?: string;

  @Column({ nullable: false })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: CollectionStatus, nullable: true })
  status?: CollectionStatus;

  @Column({ nullable: true })
  image?: string;

  //////Related fields//////
  @ManyToMany(() => ProductEntity, (product: ProductEntity) => product.collections, { nullable: true })
  @JoinTable({ name: "collection_products" })
  products!: IProduct[];
} 