import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { cancelOrder, getOrderById } from "@/lib/services/orderService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDataSource();
    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataSource();
    const updated = await cancelOrder(params.id)
    if (!updated) return NextResponse.json({ error: "Cannot update order" }, { status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}