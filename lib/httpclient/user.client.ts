import { appendQueryParams } from "@/lib/httpclient";
import { IUser } from "@/types";
import { localValues } from "../utils.localStorage";

export async function apiGetMe(userId: string) {
    const res = await fetch(appendQueryParams("/api/auth/me", { userId }), {
        credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to fetch cart from backend");

    const data = await res.json();
    return data;
}

export async function apiGetUserStats(userId: string) {
  const params = new URLSearchParams({ userId })
  const res = await fetch(
    `/api/auth/user-stats?${params}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch recent orders");

  return res.json();
}

export async function registerUser(newUser: IUser) {
    const {
        userId, 
        customer
    } = localValues()

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newUser, userId, customerId: customer.id
        }),
    });
    const data = await res.json();
    return data;
}
