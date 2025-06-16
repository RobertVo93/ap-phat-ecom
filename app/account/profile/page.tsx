'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Globe, Save } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
  const { language, setLanguage, t } = useLanguage();
  const { user, updateProfile, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredLanguage: user?.preferredLanguage || 'vi'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Cập nhật thông tin thành công!');
      
      // Update language context if changed
      if (formData.preferredLanguage !== language) {
        setLanguage(formData.preferredLanguage as 'vi' | 'en');
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

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
                Quay lại tài khoản
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            Chỉnh sửa hồ sơ
          </h1>
          <p className="text-[#8b6a42] mt-2">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Avatar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#d4c5a0]">
              <CardContent className="p-6 text-center">
                <div className="w-32 h-32 bg-[#573e1c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#efe1c1] text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-[#573e1c] text-xl mb-2">{user.name}</h3>
                <p className="text-[#8b6a42] text-sm mb-4">
                  Thành viên từ {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                </p>
                <Button
                  variant="outline"
                  className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                >
                  Thay đổi ảnh đại diện
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent>
                {message && (
                  <div className={`mb-6 p-4 rounded-lg ${
                    message.includes('thành công') 
                      ? 'bg-green-50 border border-green-200 text-green-600'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#573e1c]">Họ và tên *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#573e1c]">Số điện thoại *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#573e1c]">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-[#573e1c] flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      Ngôn ngữ ưa thích
                    </Label>
                    <Select 
                      value={formData.preferredLanguage} 
                      onValueChange={(value) => setFormData({...formData, preferredLanguage: value})}
                    >
                      <SelectTrigger className="border-[#8b6a42]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                      onClick={() => setFormData({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        preferredLanguage: user.preferredLanguage
                      })}
                    >
                      Hủy thay đổi
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
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