import { getAllCollections } from "@/lib/services/collectionService";
import { NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";

export async function GET() {
  try {
    await ensureDataSource();
    const result = await getAllCollections();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
