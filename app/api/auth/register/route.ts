import { NextResponse } from "next/server"
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { UserService } from "@/lib/services/userService";

export async function POST(req: Request) {
  try {
    await ensureDataSource()
    const userService = new UserService();
    const { userId,  fullName, email, phone, username, password } = await req.json()
    const res = await userService.createUser(userId, fullName, email, phone, username, password)
    return NextResponse.json({
      success: true,
      user: res,
    })
  } catch (err) {
    console.error("Register error:", err)
    if (err instanceof Error && err.message === "USER_WITH_USERNAME_EXISTS") {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Register fail" },
      { status: 500 }
    )
  }
}
