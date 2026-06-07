import { NextResponse } from 'next/server';
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { addCartItem, clearCart, getCartByUser } from '@/lib/services/cartService';
import { getUserFromRequest } from '@/lib/auth/request-user';

export async function GET() {
    try {
        const user = await getUserFromRequest();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
        await ensureDataSource();
        const result = await getCartByUser(user.id)

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromRequest();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await ensureDataSource();
        const data = await req.json()
        await addCartItem(user.id, data.cartItem)
        return NextResponse.json({ status: 2001 });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await ensureDataSource();
    await clearCart(user.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 