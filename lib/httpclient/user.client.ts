import { appendQueryParams } from "@/lib/httpclient";
import { IUser } from "@/types";
import { getLocalCustomer } from "../utils.localStorage";
import { v4 as uuidv4 } from "uuid"

export class ApiLocaleError extends Error {
    errorKey: string;

    constructor(errorKey: string) {
        super(errorKey);
        this.errorKey = errorKey;
    }
}

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

export async function apiChangePassword(currentPassword: string, newPassword: string) {
    const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new ApiLocaleError(data.errorKey || "account.error");
    }

    return data;
}

export async function registerUser(newUser: IUser) {
    const customer = getLocalCustomer()
    const userId = customer?.id || uuidv4()

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newUser, userId
        }),
    });
    const data = await res.json();
    return data;
}
