import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { getCurrentUser } from '@/lib/services/userService';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await ensureDataSource();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const user = await getCurrentUser(userId!)

    return NextResponse.json( user );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ user: null, error: "Failed to fetch user" });
  }
}
