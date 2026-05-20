import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { cancelOrder, getOrderById } from "@/lib/services/orderService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await ensureDataSource();
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(_req: NextRequest, { params }: RouteContext) {
  try {
    await ensureDataSource();
    const { id } = await params;
    const updated = await cancelOrder(id);
    if (!updated) return NextResponse.json({ error: "Cannot update order" }, { status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
