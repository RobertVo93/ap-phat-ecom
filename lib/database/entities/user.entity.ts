import { Entity, Column, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { Gender, UserRole } from "@/types/enums";
import { INotification, IUser } from "@/types";
import type { ICustomer } from "@/types";
import { NotificationEntity, CustomerEntity } from "@/lib/database/entities";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity implements IUser {
    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    username?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    fullName?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    phone?: string;

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

    @Column({ type: "varchar", length: 255, nullable: true })
    avatar?: string;

    @Column({ type: "enum", enum: Gender, default: Gender.male, nullable: false })
    gender?: Gender;

    @OneToOne(() => CustomerEntity, (customer) => customer.user, { nullable: true })
    customer?: ICustomer;

    @OneToMany(() => NotificationEntity, (notification) => notification.user)
    notifications?: INotification[];
} 
