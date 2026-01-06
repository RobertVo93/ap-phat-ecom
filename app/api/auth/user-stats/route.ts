import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { UserService } from '@/lib/services/userService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await ensureDataSource();
    const userService = new UserService();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || '';
    const result = await userService.getUserStats(userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}