import { NextRequest, NextResponse } from "next/server";
import { createOrderForGuest, createOrderForAuthenticatedUser, getOrders } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { IOrder, OrderStatus } from "@/types";
import { getUserFromRequest } from "@/lib/auth/request-user";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);

    const searchTerm = searchParams.get("searchTerm") || undefined;
    const status = searchParams.get("status") as OrderStatus || undefined;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;

    const result = await getOrders({ customerId: user.id, searchTerm, status, limit, offset });

    return NextResponse.json(result.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDataSource();
    const user = await getUserFromRequest();
    const { data } = await req.json();
    let created: IOrder;
    if (user) {
      created = await createOrderForAuthenticatedUser(data as IOrder, user.id);
    }
    else {
      created = await createOrderForGuest(data as IOrder);
    }
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
 
