import { appendQueryParams } from "@/lib/httpclient";

export async function getFeaturedProducts() {
  const url = appendQueryParams("/api/products");
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");

  return res.json();
}