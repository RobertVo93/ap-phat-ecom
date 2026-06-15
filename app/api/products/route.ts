import { NextResponse, NextRequest } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getAllProducts } from "@/lib/services/productService";

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrderParam = searchParams.get("sortOrder");
    const sortOrder = sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : "desc";
    const status = searchParams.get("status") || "active";
    const search = searchParams.get("search") || undefined;
    const collectionId = searchParams.get("collectionId") || undefined;
    const priceRange = searchParams.get("priceRange") ? JSON.parse(searchParams.get("priceRange") as string) : undefined;
    const stockRange = searchParams.get("stockRange") ? JSON.parse(searchParams.get("stockRange") as string) : undefined;

    const result = await getAllProducts({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { collectionId, status, search, priceRange, stockRange },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
