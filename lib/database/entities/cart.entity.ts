import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { ICart, ICartItem } from "@/types";
import { CartItemEntity } from "./cart-item.entity";

@Entity({ name: "carts" })
export class CartEntity extends BaseEntity implements ICart{
    @Column({ name: "user_id", nullable: true })
    userId?: string;

    @Column({ name: "total_quantity", type: "int", default: 0 })
    totalQuantity?: number;

    @Column({ name: "total_price", type: "float", default: 0 })
    totalPrice?: number;

    @OneToMany(() => CartItemEntity, item => item.cart, { cascade: true })
    items?: ICartItem[];
} 