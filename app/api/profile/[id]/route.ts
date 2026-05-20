import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { updateProfile } from "@/lib/services/profileService";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await ensureDataSource();
    const data = await req.json();
    const { id } = await params;
    const updated = await updateProfile(id, data.data);
    if (!updated) return NextResponse.json({ error: "Cannot update user" }, { status: 400 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
