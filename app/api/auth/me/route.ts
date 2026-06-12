import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { UserService } from '@/lib/services/userService';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await ensureDataSource();
    const userService = new UserService();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const user = await userService.getCurrentUser(userId!)

    return NextResponse.json( user );
  } catch (err) {
    console.error("Error fetching current user:", err);
    return NextResponse.json({ user: null, error: "Failed to fetch user" });
  }
}
