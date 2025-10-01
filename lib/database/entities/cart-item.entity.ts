import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CartEntity, ProductEntity } from "@/lib/database/entities";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { ICartItem } from "@/types";

@Entity({ name: "cart-items" })
export class CartItemEntity extends BaseEntity implements ICartItem{
    @Column({ type: "int", default: 1 })
    quantity?: number;

    @Column({ type: "float", default: 0 })
    price?: number;

    @Column({ type: "float", default: 0 })
    subtotal?: number;

    @ManyToOne(() => CartEntity, cart => cart.items)
    @JoinColumn({ name: "cart_id" })
    cart?: CartEntity;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: "product_id" })
    product?: ProductEntity;
} 