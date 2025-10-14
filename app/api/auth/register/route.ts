import { NextResponse } from "next/server"
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { createNewUser } from "@/lib/services/userService";

export async function POST(req: Request) {
  try {
    await ensureDataSource()
    const { email, phone, username, password } = await req.json()

    const user = await createNewUser(email, phone, username, password)

    return NextResponse.json({
      success: true,
      user: user,
    })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json(
      { success: false, message: "Register fail" },
      { status: 500 }
    )
  }
}
