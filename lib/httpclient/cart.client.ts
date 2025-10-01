import { appendQueryParams } from "@/lib/httpclient";
import { ICartItem } from "@/types";

export async function syncCartFromBackend(userId: string) {
    try {
        const res = await fetch(appendQueryParams("/api/carts",
            { userId }),
            { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch cart from backend");

        return await res.json();
    } catch (err) {
        console.error("Error syncing cart from backend:", err);
        return [];
    }
}

export async function addToCart(userId: string, cartItem: ICartItem) {
    const res = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, cartItem }),
    });
    if (!res.ok) throw new Error("Failed to create");
    return await res.json();
}

export async function updateCartItem(
    cartItemId: string,
    quantity: number
) {
    const res = await fetch(`/api/carts/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId, quantity }),
    });

    if (!res.ok) {
        throw new Error("Failed to update");
    }

    return res.json();
}

export async function deleteCartItem(cartItemId: string) {
    const res = await fetch(`/api/carts/item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId }),
    });
    if (!res.ok) throw new Error("Failed to delete");
    return res;
} 
