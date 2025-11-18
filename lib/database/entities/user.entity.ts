import { Entity, Column, OneToOne } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { UserRole } from "@/types/enums";
import { IUser } from "@/types";
import { CustomerEntity } from "./customer.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity implements IUser {
    @Column({ type: "varchar", length: 255, nullable: false })
    fullName?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    email?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    phone?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    username?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    passwordSalt?: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.staff, nullable: false })
    role?: UserRole;

    @Column({ type: "boolean", default: true, nullable: false })
    active?: boolean;

    @Column({ type: "timestamp", nullable: true })
    lastLogin?: Date;

    @OneToOne(() => CustomerEntity, (customer) => customer.user, { nullable: true })
    customer?: CustomerEntity;
} 