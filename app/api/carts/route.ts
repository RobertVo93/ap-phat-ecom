import { NextResponse } from 'next/server';
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { addCartItem, syncCartFromBE } from '@/lib/services/cartService';

export async function GET(req: Request) {
    try {
        await ensureDataSource();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId") || undefined

        const result = await syncCartFromBE(userId!)

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await ensureDataSource();
        const data = await req.json()
        await addCartItem(data.userId, data.cartItem)
        return NextResponse.json({ status: 2001 });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

