import { InvalidResetPasswordLink, ResetPasswordForm } from "@/components/auth/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const tokenParam = Array.isArray(params.token) ? params.token[0] : params.token;
  const token = tokenParam?.trim() || "";

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {token ? <ResetPasswordForm token={token} /> : <InvalidResetPasswordLink />}
    </div>
  );
}
