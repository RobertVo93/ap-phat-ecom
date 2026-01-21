import { IAddress } from "@/types";
import { appendQueryParams } from "./base";

export async function apiGetAddresses(customerId: string) {
  const url = appendQueryParams("/api/addresses", { customerId });
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return res.json();
}

export async function apiAddAddress(customerId: string, data: IAddress) {
  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ customerId, data }),
  });
  if (!res.ok) throw new Error("Failed to create address");
  return res.json();
}

export async function apiUpdateAddress(id: string, data: IAddress) {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("Failed to update address");
  return res.json();
}

export async function apiDeleteAddress(id: string) {
  const res = await fetch(`/api/addresses/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete address");
  return res;
}
