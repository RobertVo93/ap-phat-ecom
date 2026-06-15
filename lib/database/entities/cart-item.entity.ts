import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { ICartItem } from "@/types";
import type { ICart, IProduct } from "@/types";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "./product.entity";

@Entity({ name: "cart_items" })
export class CartItemEntity extends BaseEntity implements ICartItem{
    @Column({ type: "int", default: 1 })
    quantity?: number;

    @Column({ type: "float", default: 0 })
    price?: number;

    @Column({ type: "float", default: 0 })
    subtotal?: number;

    @ManyToOne(() => CartEntity, cart => cart.items)
    @JoinColumn({ name: "cart_id" })
    cart?: ICart;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: "product_id" })
    product?: IProduct;
} 