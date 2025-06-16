'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Bell, Shield, Eye, EyeOff, Save } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    sms: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    orderHistoryVisible: false,
    reviewsVisible: true
  });

  if (!user) {
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Mật khẩu mới không khớp');
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      setIsSaving(false);
      return;
    }

    try {
      // In real app, validate current password with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Cập nhật cài đặt thông báo thành công!');
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacySave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Cập nhật cài đặt bảo mật thành công!');
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
            Cài đặt tài khoản
          </h1>
          <p className="text-[#8b6a42] mt-2">
            Quản lý cài đặt bảo mật và thông báo
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('thành công') 
              ? 'bg-green-50 border border-green-200 text-green-600'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Password Change */}
          <Card className="bg-white border-[#d4c5a0]">
            <CardHeader>
              <CardTitle className="text-[#573e1c] flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Đổi mật khẩu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-[#573e1c]">Mật khẩu hiện tại *</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="pr-10 border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] hover:text-[#573e1c]"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-[#573e1c]">Mật khẩu mới *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="pr-10 border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] hover:text-[#573e1c]"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#573e1c]">Xác nhận mật khẩu mới *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="pr-10 border-[#8b6a42] focus:border-[#573e1c]"
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
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Đang lưu...' : 'Đổi mật khẩu'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white border-[#d4c5a0]">
            <CardHeader>
              <CardTitle className="text-[#573e1c] flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Cập nhật đơn hàng</Label>
                    <p className="text-sm text-[#8b6a42]">Nhận thông báo về trạng thái đơn hàng</p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Khuyến mãi</Label>
                    <p className="text-sm text-[#8b6a42]">Nhận thông báo về các chương trình khuyến mãi</p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Bản tin</Label>
                    <p className="text-sm text-[#8b6a42]">Nhận bản tin hàng tuần về sản phẩm mới</p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => setNotifications({...notifications, newsletter: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Tin nhắn SMS</Label>
                    <p className="text-sm text-[#8b6a42]">Nhận thông báo qua SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNotificationSave}
                  disabled={isSaving}
                  className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white border-[#d4c5a0]">
            <CardHeader>
              <CardTitle className="text-[#573e1c] flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Cài đặt riêng tư
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Hiển thị hồ sơ công khai</Label>
                    <p className="text-sm text-[#8b6a42]">Cho phép người khác xem thông tin cơ bản</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Lịch sử mua hàng</Label>
                    <p className="text-sm text-[#8b6a42]">Hiển thị lịch sử mua hàng trong hồ sơ</p>
                  </div>
                  <Switch
                    checked={privacy.orderHistoryVisible}
                    onCheckedChange={(checked) => setPrivacy({...privacy, orderHistoryVisible: checked})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-[#573e1c] font-medium">Đánh giá sản phẩm</Label>
                    <p className="text-sm text-[#8b6a42]">Hiển thị tên trong các đánh giá sản phẩm</p>
                  </div>
                  <Switch
                    checked={privacy.reviewsVisible}
                    onCheckedChange={(checked) => setPrivacy({...privacy, reviewsVisible: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handlePrivacySave}
                  disabled={isSaving}
                  className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cài đặt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}