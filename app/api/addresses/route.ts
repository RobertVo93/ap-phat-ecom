import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { createUserAddress, getUserAddresses } from "@/lib/services/addressService";

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);

    const customerId = searchParams.get("customerId") || undefined;
    const result = await getUserAddresses(customerId!);

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch addresses";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDataSource();
    const { data, customerId } = await req.json();
    const created = await createUserAddress(customerId, data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
