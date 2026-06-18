"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrand } from "@/lib/contexts/setting-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { forgotPassword } from "@/lib/httpclient";

export function ForgotPasswordForm() {
  const { t, language } = useLanguage();
  const brand = useBrand();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedUsername = username.trim();
    if (!normalizedUsername) {
      setError(t("auth.forgotPassword.error.required"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword({ username: normalizedUsername, language });
      if (res.success) {
        setSuccess(
          res.status === "already_sent"
            ? t("auth.forgotPassword.alreadySent")
            : t("auth.forgotPassword.success")
        );
      } else {
        setError(t("auth.forgotPassword.error.failed"));
      }
    } catch (err) {
      const isUsernameNotFound = err instanceof Error && err.message === "Username does not exist";
      setError(
        isUsernameNotFound
          ? t("auth.forgotPassword.error.usernameNotFound")
          : t("auth.forgotPassword.error.failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="flex items-center">
        <Button asChild variant="ghost" className="text-[#573e1c] hover:bg-[#efe1c1]">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </Button>
      </div>

      <Card className="bg-white border-[#d4c5a0] shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-[#573e1c] rounded-full flex items-center justify-center">
              <Image
                alt='an phat food'
                src='/AP-logo-nobg.png'
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <span className="text-[#573e1c] font-bold text-xl">{brand.name}</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#573e1c]">
            {t("auth.forgotPassword.title")}
          </CardTitle>
          <p className="text-[#8b6a42] mt-2">
            {t("auth.forgotPassword.subtitle")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[#8b6a42]">
              {t("auth.forgotPassword.description")}
            </p>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#573e1c]">
                {t("auth.forgotPassword.username")}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                  placeholder={t("auth.forgotPassword.usernamePlaceholder")}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300"
            >
              {isLoading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
