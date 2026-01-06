import { appendQueryParams } from "@/lib/httpclient";
import { IProductFilters } from "@/types";

export async function getProducts(params: IProductFilters = {}) {
  const url = appendQueryParams("/api/products", params);
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");

  return res.json();
}

export async function getProductById(id: string) {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}