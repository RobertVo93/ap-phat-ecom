import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { markAllAsReadService } from '@/lib/services/notificationService';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const result = await markAllAsReadService(userId);
    
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to mark all as read";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}