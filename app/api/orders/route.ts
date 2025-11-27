import { NextRequest, NextResponse } from "next/server";
import { createOrderService } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { CreateOrderSchema } from "./order.schema";

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