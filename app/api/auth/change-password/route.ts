import { NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/request-user";
import { UserService } from "@/lib/services/userService";

export async function PUT(req: Request) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json(
      { errorKey: "account.passwordChange.unauthorized" },
      { status: 401 }
    );
  }

  try {
    await ensureDataSource();

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { errorKey: "account.mustFillTheForm" },
        { status: 400 }
      );
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json(
        { errorKey: "account.passwordLength" },
        { status: 400 }
      );
    }

    const userService = new UserService();
    await userService.changePassword(user.id, currentPassword, newPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing user password:", error);
    if (error instanceof Error) {
      if (error.message === "INVALID_CURRENT_PASSWORD") {
        return NextResponse.json(
          { errorKey: "account.passwordChange.invalidCurrentPassword" },
          { status: 400 }
        );
      }

      if (error.message === "PASSWORD_LOGIN_NOT_AVAILABLE") {
        return NextResponse.json(
          { errorKey: "account.passwordChange.passwordLoginUnavailable" },
          { status: 400 }
        );
      }

      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          { errorKey: "account.passwordChange.userNotFound" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { errorKey: "account.error" },
      { status: 500 }
    );
  }
}
