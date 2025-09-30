import { appendQueryParams } from "@/lib/httpclient";

export async function getCollections() {
  const url = appendQueryParams("/api/collections");
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");

  return res.json();
}

export async function getCollectionById(id: string) {
  const res = await fetch((`/api/collections/${id}`), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collection");
  return res.json();
}