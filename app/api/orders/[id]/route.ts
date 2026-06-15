import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/request-user";
import { cancelOrder, getOrderByIdForUser } from "@/lib/services/orderService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const { id } = await params;
    const order = await getOrderByIdForUser(id, user.id);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order by id:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(_req: NextRequest, { params }: RouteContext) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const { id } = await params;
    const updated = await cancelOrder(id, user.id);
    if (!updated) return NextResponse.json({ error: "Cannot update order" }, { status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
