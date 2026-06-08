import { CustomerStatus, CustomerType, ICustomer } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const getLocalCustomer = (): ICustomer => {
  let rawCustomer = localStorage.getItem("ecom_customer");
  try {
    return rawCustomer ? JSON.parse(rawCustomer) as ICustomer : renewLocalCustomer();
  }
  catch (e) {
    console.error("Failed to parse the customer, generating a new one.", e);
    return renewLocalCustomer();
  }
}

export const updateLocalCustomer = (customer: ICustomer) => {
  localStorage.setItem("ecom_customer", JSON.stringify(customer))
}

export const renewLocalCustomer = (): ICustomer => {
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
  updateLocalCustomer(newCustomer);
  return newCustomer;
}
