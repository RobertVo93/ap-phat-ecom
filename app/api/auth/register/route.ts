import { NextResponse } from "next/server"
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { UserService } from "@/lib/services/userService";

export async function POST(req: Request) {
  try {
    await ensureDataSource()
    const userService = new UserService();
    const { userId, customerId,  fullName, email, phone, username, password } = await req.json()
    // Check if user already exists
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) {
        return NextResponse.json(
            { error: "User with this username already exists" },
            { status: 400 }
        );
    }

    const res = await userService.createUser(userId, customerId, fullName, email, phone, username, password)
    return NextResponse.json({
      success: true,
      user: res,
    })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json(
      { success: false, message: "Register fail" },
      { status: 500 }
    )
  }
}
