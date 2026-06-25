import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { CustomerEntity } from "./customer.entity";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/enums";
import { IOrderItem, IOrder } from "@/types";
import type { ICustomer } from "@/types";
import { CommonService } from "@/lib/services/commonService";

@Entity({ name: "orders" })
export class OrderEntity extends BaseEntity implements IOrder {
  @Column({ unique: true })
  number?: string;

  @Column({ type: "timestamp", nullable: true })
  deliveryDate?: Date;

  @Column({ type: "float", nullable: true })
  totalAmount?: number;

  @Column({ type: "enum", enum: OrderStatus, nullable: true })
  status?: OrderStatus;

  @Column({ type: "enum", enum: PaymentStatus, nullable: true })
  paymentStatus?: PaymentStatus;

  @Column({ type: "enum", enum: PaymentMethod, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  shippingAddress?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column("text", { array: true, nullable: true })
  tags?: string[];

  @Column({ type: "float", nullable: true })
  shippingFee?: number;

  @Column({ type: "float", nullable: true })
  tax?: number;

  @Column({ type: "jsonb", nullable: true })
  items!: IOrderItem[];

  @Column({ type: "jsonb", nullable: true })
  receiverInfo?: {
    name?: string;
    phone?: string;
  };

  @Column({ name: "warehouse_id", type: "uuid", nullable: true })
  warehouseId?: string;

  //////Related fields//////
  @ManyToOne(() => CustomerEntity, (customer: CustomerEntity) => customer.orders, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: ICustomer;

  //////Auto order numbering//////
  @BeforeInsert()
  async generateOrderNumber() {
    if (!this.number) {
      const commonService = new CommonService();
      this.number = await commonService.getEntityNumber(OrderEntity, "ORD");
    }
  }
}
