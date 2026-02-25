import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { markAsReadService } from '@/lib/services/notificationService';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataSource();
    const notificationId = params.id;
    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }
    const result = await markAsReadService(notificationId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}