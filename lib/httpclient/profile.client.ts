import { IProfile } from "@/types";

export async function apiUpdateProfile(id: string, data: IProfile) {
  const res = await fetch(`/api/profile/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
}