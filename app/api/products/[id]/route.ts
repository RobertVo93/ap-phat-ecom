import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/services/productService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDataSource();
    const product = await getProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}