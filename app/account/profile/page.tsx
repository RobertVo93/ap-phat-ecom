'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Save, CircleUser } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { useProfile } from '@/hooks/use-profile';
import { Gender } from '@/types';

export default function ProfilePage() {
  const {
    formData,
    user,
    isSaving,

    t,
    setFormData,
    handleSubmit,
    handleAvatarChange,
    onCancel
  } = useProfile()

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              asChild
              variant="ghost"
              className="text-[#573e1c] hover:bg-[#efe1c1]"
            >
              <Link href="/account">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('account.backToAccount')}
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('account.editProfile')}
          </h1>
          <p className="text-[#8b6a42] mt-2">
            {t('account.updatePersonalInfo')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Avatar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#d4c5a0]">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  {formData.avatar ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#573e1c] mx-auto">
                      <img
                        src={formData.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-[#573e1c] rounded-full flex items-center justify-center mx-auto">
                      <span className="text-[#efe1c1] text-4xl font-bold">
                        {user.username!.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Upload indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#573e1c] rounded-full flex items-center justify-center border-2 border-white">
                    <User className="w-4 h-4 text-[#efe1c1]" />
                  </div>
                </div>

                <h3 className="font-semibold text-[#573e1c] text-xl mb-2">{user.fullName}</h3>
                <p className="text-[#8b6a42] text-sm mb-4">
                  {t('account.memberSince')} {new Date(user.createdAt!).toLocaleDateString('vi-VN')}
                </p>

                <AvatarUpload
                  currentAvatar={formData.avatar}
                  onAvatarChange={handleAvatarChange}
                />

                {/* Avatar Tips */}
                <div className="mt-4 p-3 bg-[#efe1c1] rounded-lg">
                  <p className="text-xs text-[#8b6a42] text-left">
                    <strong>{t('account.avatarNote')}</strong>
                    <br />{t('account.maxSize')}
                    <br />{t('account.formats')}
                    <br />{t('account.avatarCrop')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {t('account.personalInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-[#573e1c]">{t("auth.login.username")}</Label>
                    <div className="relative">
                      <CircleUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#573e1c]">{t('account.fullName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#573e1c]">{t('account.phoneNumber')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#573e1c]">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-[#573e1c]">{t("account.gender")}</Label>
                    <div className="flex justify-start gap-10">
                      {Object.values(Gender).map((gender) => (
                        <div
                          className="flex items-center gap-1 cursor-pointer hover:underline"
                          key={`div-gender-${gender}`}
                        >
                          <Checkbox
                            id={`checkbox-gender-${gender}`}
                            checked={formData.gender === gender}
                            onCheckedChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                gender,
                              }))
                            }}
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                          />
                          <Label
                            htmlFor={`checkbox-gender-${gender}`}
                            className="cursor-pointer"
                          >
                            {t(`account.gender.${gender}`)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                      onClick={onCancel}
                    >
                      {t('account.cancelChanges')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? t('account.saving') : t('account.saveChanges')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}