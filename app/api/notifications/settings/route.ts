import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getNotificationSettingsService } from "@/lib/services/notificationService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;
    const result = await getNotificationSettingsService(userId!);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch notifications";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
