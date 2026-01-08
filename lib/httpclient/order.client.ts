import { IOrder, IOrderFilters } from "@/types";
import { appendQueryParams } from "./base";

export async function createOrder(data: Partial<IOrder>) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function apiGetOrders(params: IOrderFilters = {}) {
  const url = appendQueryParams("/api/orders", params);
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}
