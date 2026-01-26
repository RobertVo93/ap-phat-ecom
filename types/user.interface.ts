import { IBase } from "./base.interface";
import { ICustomer } from "./customer.interface";
import { Gender, UserRole } from "./enums";

export interface IUser extends IBase {
  fullName?: string
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordSalt?: string;
  role?: UserRole;
  active?: boolean;
  lastLogin?: Date;
  customer?: ICustomer
  avatar?: string
  gender?: Gender
}