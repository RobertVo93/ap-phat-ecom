'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const { t } = useLanguage();
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password, rememberMe);
      router.push('/account');
    } catch (err) {
      setError(t('auth.login.error.invalid'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      router.push('/account');
    } catch (err) {
      setError(t('auth.login.error.google'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Button
            asChild
            variant="ghost"
            className="text-[#573e1c] hover:bg-[#efe1c1]"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('auth.login.backToHome')}
            </Link>
          </Button>
        </div>

        <Card className="bg-white border-[#d4c5a0] shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#573e1c] rounded-full flex items-center justify-center">
                <span className="text-[#efe1c1] font-bold">RT</span>
              </div>
              <span className="text-[#573e1c] font-bold text-xl">Rice & Noodles</span>
            </div>
            <CardTitle className="text-2xl font-bold text-[#573e1c]">
              {t('auth.login.title')}
            </CardTitle>
            <p className="text-[#8b6a42] mt-2">
              {t('auth.login.subtitle')}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#573e1c]">{t('auth.login.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder={t('auth.login.emailPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#573e1c]">{t('auth.login.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="pl-10 pr-10 border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder={t('auth.login.passwordPlaceholder')}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm text-[#8b6a42]">
                    {t('auth.login.rememberMe')}
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#573e1c] hover:text-[#8b6a42] underline"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300"
              >
                {isLoading ? t('auth.login.submitting') : t('auth.login.submit')}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#8b6a42]">{t('auth.login.or')}</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-12 text-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.login.withGoogle')}
            </Button>

            <div className="text-center">
              <p className="text-[#8b6a42]">
                {t('auth.login.noAccount')}{' '}
                <Link
                  href="/auth/register"
                  className="text-[#573e1c] hover:text-[#8b6a42] font-semibold underline"
                >
                  {t('auth.login.register')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}