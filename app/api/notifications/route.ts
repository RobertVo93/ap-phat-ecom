import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getAllNotificationsService } from "@/lib/services/notificationService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = Number(searchParams.get("offset")) || 0;
    const result = await getAllNotificationsService({ userId, offset, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch notifications";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
