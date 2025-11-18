import { NextResponse } from "next/server"
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { createNewUser } from "@/lib/services/userService";

export async function POST(req: Request) {
  try {
    await ensureDataSource()
    const { userId, customerId,  fullName, email, phone, username, password } = await req.json()

    const res = await createNewUser(userId, customerId, fullName, email, phone, username, password)

    if (typeof res === "string") {
      return NextResponse.json({
        success: false
      })
    } else {
      return NextResponse.json({
        success: true,
        user: res,
      })
    }
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json(
      { success: false, message: "Register fail" },
      { status: 500 }
    )
  }
}
