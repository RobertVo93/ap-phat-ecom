"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrand } from "@/lib/contexts/setting-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { resetPassword } from "@/lib/httpclient";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shouldRequestNewLink, setShouldRequestNewLink] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setShouldRequestNewLink(false);

    if (!token) {
      setError(t("auth.resetPassword.error.invalidLink"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.resetPassword.error.passwordMismatch"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({ token, password });
      if (res.success) {
        setSuccess(t("auth.resetPassword.success"));
        setTimeout(() => router.push("/login"), 1200);
      } else {
        setError(t("auth.resetPassword.error.failed"));
      }
    } catch (err) {
      const isInvalidOrExpiredToken = err instanceof Error && err.message === "Invalid or expired reset token";
      setShouldRequestNewLink(isInvalidOrExpiredToken);
      setError(
        isInvalidOrExpiredToken
          ? t("auth.resetPassword.error.invalidOrExpiredLink")
          : t("auth.resetPassword.error.failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordCard title={t("auth.resetPassword.title")} subtitle={t("auth.resetPassword.subtitle")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
        {shouldRequestNewLink && (
          <div className="text-center text-sm">
            <Link href="/forgot-password" className="text-[#573e1c] hover:text-[#8b6a42] underline">
              {t("auth.resetPassword.requestNewLink")}
            </Link>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#573e1c]">
            {t("auth.resetPassword.password")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-10 pr-10 border-[#8b6a42] focus:border-[#573e1c]"
              placeholder={t("auth.resetPassword.passwordPlaceholder")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] hover:text-[#573e1c]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#573e1c]">
            {t("auth.resetPassword.confirmPassword")}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="pl-10 pr-10 border-[#8b6a42] focus:border-[#573e1c]"
              placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] hover:text-[#573e1c]"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || Boolean(success)}
          className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300"
        >
          {isLoading ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submit")}
        </Button>
      </form>
    </ResetPasswordCard>
  );
}

export function InvalidResetPasswordLink() {
  const { t } = useLanguage();

  return (
    <ResetPasswordCard title={t("auth.resetPassword.title")} subtitle={t("auth.resetPassword.subtitle")}>
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {t("auth.resetPassword.error.invalidOrExpiredLink")}
        </div>
        <div className="text-center text-sm">
          <Link href="/forgot-password" className="text-[#573e1c] hover:text-[#8b6a42] underline">
            {t("auth.resetPassword.requestNewLink")}
          </Link>
        </div>
      </div>
    </ResetPasswordCard>
  );
}

function ResetPasswordCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const brand = useBrand();
  const { t } = useLanguage();

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="flex items-center">
        <Button asChild variant="ghost" className="text-[#573e1c] hover:bg-[#efe1c1]">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("auth.resetPassword.backToLogin")}
          </Link>
        </Button>
      </div>

      <Card className="bg-white border-[#d4c5a0] shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-[#573e1c] rounded-full flex items-center justify-center">
              <span className="text-[#efe1c1] font-bold">AP</span>
            </div>
            <span className="text-[#573e1c] font-bold text-xl">{brand.name}</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#573e1c]">{title}</CardTitle>
          <p className="text-[#8b6a42] mt-2">{subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}
