import { IBase, IBaseFilters } from "./base.interface";
import { OrderStatus, PaymentMethod, PaymentStatus, ProductUnit } from "@/types/enums";
import { ICustomer } from "@/types"

export interface IOrder extends IBase {
  number?: string
  deliveryDate?: Date
  totalAmount?: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: PaymentMethod
  shippingAddress?: string
  notes?: string
  tags?: string[]
  tax?: number
  shippingFee?: number
  items?: IOrderItem[]
  customer?: ICustomer
  receiverInfo?: {
    name?: string
    phone?: string
  }
}

export interface IOrderItem {
  id?: string
  name?: string
  quantity?: number
  totalCost?: number
  unitCost?: number
  unit?: ProductUnit
  number?: string
}

export interface OrderFilters extends IBaseFilters{
  searchTerm?: string
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  dateFrom?: string
  dateTo?: string
  totalAmountFrom?: number
  totalAmountTo?: number
  customer?: string
}

export type OrderSortBy = "deliveryDate" | "totalAmount" | "customer" | "number"