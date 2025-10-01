import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { deleteCartItem, updateCartItemQuantity } from "@/lib/services/cartService";

export async function PUT(req: NextRequest) {
  try {
    await ensureDataSource();
    const { cartItemId, quantity } = await req.json();
    await updateCartItemQuantity(cartItemId, quantity);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureDataSource();
    const { cartItemId } = await req.json()
    await deleteCartItem(cartItemId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 