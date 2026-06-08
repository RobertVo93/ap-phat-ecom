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

export async function apiGetOrder(id: string) {
  const res = await fetch(`/api/orders/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function apiGetGuestOrder(id: string, customerId: string) {
  const params = new URLSearchParams({ customerId });
  const res = await fetch(`/api/guest/orders/${id}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch guest order");
  return res.json();
}

export async function apiCancelOrder(id: string) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
}
