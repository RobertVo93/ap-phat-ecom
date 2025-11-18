import { CustomerStatus, CustomerType, ICustomer } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const localValues = () => {
  const userId = localStorage.getItem("user_id")
  const rawCustomer = localStorage.getItem("customer")
  const customer = JSON.parse(rawCustomer!) as ICustomer

  return {
    userId,
    customer,
  }
}

export const renewUserAndCustomer = () => {
  const user_id = uuidv4()
  localStorage.setItem("user_id", user_id)
  const newCustomer: ICustomer = {
    id: uuidv4(),
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
  localStorage.setItem("customer", JSON.stringify(newCustomer))
}