'use client';

import React from 'react';
import {
  AccountSettingsHeader,
  NotificationSettingsCard,
  PasswordSettingsCard,
  PrivacySettingsCard,
  SettingsMessage,
} from '@/components/account/settings';
import { LoadingOverlay } from '@/components/common/LoadOverlay';
import { useAccountSettings } from '@/hooks/use-account-settings';

export default function SettingsPage() {
  const {
    loading,
    user,
    message,
    showCurrentPassword,
    passwordData,
    notiSettings,
    showNewPassword,
    showConfirmPassword,
    isSaving,
    privacy,
    notiSaving,
    setPrivacy,
    t,
    handlePasswordChange,
    setPasswordData,
    setShowConfirmPassword,
    setShowCurrentPassword,
    setShowNewPassword,
    handlePrivacySave,
    handleNotificationSave,
    toggleNotiSetting,
    setNotiSettings,
  } = useAccountSettings();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <LoadingOverlay loading={loading} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AccountSettingsHeader t={t} />
        <SettingsMessage message={message} t={t} />

        <div className="space-y-6">
          <PasswordSettingsCard
            isSaving={isSaving}
            passwordData={passwordData}
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            t={t}
            handlePasswordChange={handlePasswordChange}
            setPasswordData={setPasswordData}
            setShowConfirmPassword={setShowConfirmPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            setShowNewPassword={setShowNewPassword}
          />

          <NotificationSettingsCard
            notiSaving={notiSaving}
            notiSettings={notiSettings}
            t={t}
            handleNotificationSave={handleNotificationSave}
            setNotiSettings={setNotiSettings}
            toggleNotiSetting={toggleNotiSetting}
          />

          <PrivacySettingsCard
            isSaving={isSaving}
            privacy={privacy}
            t={t}
            handlePrivacySave={handlePrivacySave}
            setPrivacy={setPrivacy}
          />
        </div>
      </div>
    </div>
  );
}
