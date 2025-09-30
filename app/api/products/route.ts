import { NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getFeaturedProducts } from "@/lib/services/productService";

export async function GET() {
  try {
    await ensureDataSource();
    const result = await getFeaturedProducts();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
