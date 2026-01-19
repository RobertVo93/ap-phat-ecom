import { CustomerStatus, CustomerType } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { IAddress, IOrder, IUser } from "@/types";

export interface ICustomer extends IBase {
  number?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  location?: string
  lastOrder?: Date
  status?: CustomerStatus
  customerType?: CustomerType
  joinDate?: Date
  notes?: string
  orders?: IOrder[]
  totalSpend?: number
  user?: IUser
  addresses?: IAddress[]
}

export interface ICustomerFilters extends IBaseFilters {
  status?: string
  searchTerm?: string
  customerType?: string
}
