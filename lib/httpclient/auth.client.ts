import type { Language } from "@/types";

interface IForgotPasswordRequest {
  username: string;
  language: Language;
}

interface IResetPasswordRequest {
  token: string;
  password: string;
}

interface IAuthResponse {
  success?: boolean;
  status?: "sent" | "already_sent";
  error?: string;
}

async function readAuthResponse(response: Response, fallbackMessage: string): Promise<IAuthResponse> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || fallbackMessage);
  }

  return data;
}

export async function forgotPassword(data: IForgotPasswordRequest): Promise<IAuthResponse> {
  const response = await fetch("/admin/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      resetPath: "/reset-password",
    }),
  });

  return readAuthResponse(response, "Failed to request password reset");
}

export async function resetPassword(data: IResetPasswordRequest): Promise<IAuthResponse> {
  const response = await fetch("/admin/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return readAuthResponse(response, "Failed to reset password");
}
