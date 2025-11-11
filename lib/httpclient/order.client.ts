import { IOrder } from "@/types";

export async function createOrder(data: Partial<IOrder>, email: string, phone: string) {
  // email and phone number of this function are user email, phone and are used to get customer of this user
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      ...data,
      email,
      phone
    }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
