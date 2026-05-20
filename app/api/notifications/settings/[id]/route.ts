import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { updateNotificationSettingsService } from "@/lib/services/notificationService";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await ensureDataSource();
    const data = await req.json();
    const { id } = await params;
    const updated = await updateNotificationSettingsService(id, data);
    if (!updated) return NextResponse.json({ error: "Cannot update notification settings" }, { status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
