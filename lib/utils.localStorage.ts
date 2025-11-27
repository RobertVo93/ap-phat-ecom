import { CustomerStatus, CustomerType, ICustomer } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const localValues = () => {
  const userId = localStorage.getItem("ecom_user_id")
  const rawCustomer = localStorage.getItem("ecom_customer")
  const customer = JSON.parse(rawCustomer!) as ICustomer

  return {
    userId,
    customer,
  }
}

export const localUpdateCustomer = (customer: ICustomer) => {
  localStorage.setItem("ecom_customer", JSON.stringify(customer))
}

export const renewUserAndCustomer = () => {
  const user_id = uuidv4()
  localStorage.setItem("ecom_user_id", user_id)
  const newCustomer: ICustomer = {
    id: user_id,
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    customerType: CustomerType.regular,
    status: CustomerStatus.active,
    notes: "",
    orders: [],
    totalSpend: 0,
  }
  localStorage.setItem("ecom_customer", JSON.stringify(newCustomer))
}