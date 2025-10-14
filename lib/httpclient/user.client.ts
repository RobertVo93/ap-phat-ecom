import { appendQueryParams } from "@/lib/httpclient";
import { IUser } from "@/types";

export async function apiGetMe(userId: string) {
    const res = await fetch(appendQueryParams("/api/auth/me", { userId }), {
        credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to fetch cart from backend");

    const data = await res.json();
    return data;
}

export async function registerUser(newUser: IUser) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
    });
    const data = await res.json();
    return data;
}
