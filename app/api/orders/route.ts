import { NextRequest, NextResponse } from "next/server";
import { createOrderService, getOrders } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { CreateOrderSchema } from "./order.schema";
import { OrderStatus } from "@/types";

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);

    const customerId = searchParams.get("customerId") || undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;
    const status = searchParams.get("status") as OrderStatus || undefined;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    const result = await getOrders({ customerId, searchTerm, status, limit, offset });

    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDataSource();
    const { data } = await req.json();
    const parseData = CreateOrderSchema.safeParse(data);
    if (!parseData.success) {
      return NextResponse.json({ error: "Invalid input", details: parseData.error.errors }, { status: 400 });
    }
    const created = await createOrderService(parseData.data as OrderEntity);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
 