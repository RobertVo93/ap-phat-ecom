import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { markAsReadService } from '@/lib/services/notificationService';
import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_req: NextRequest, { params }: RouteContext) {
  try {
    await ensureDataSource();
    const { id: notificationId } = await params;
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }
    const result = await markAsReadService(notificationId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
