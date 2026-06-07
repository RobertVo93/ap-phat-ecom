'use client'

import { useAuth } from "@/lib/contexts/auth-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { useNotification } from "@/lib/contexts/notification-context";
import { ApiLocaleError, apiChangePassword } from "@/lib/httpclient/user.client";
import { apiGetNotificationSettings, apiUpdateNotificationSettings } from "@/lib/httpclient/notification.client";
import { INotificationSettings } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAccountSettings = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { fetchNotifications } = useNotification()
  const [loading, setLoading] = useState<boolean>(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notiSettings, setNotiSettings] = useState<INotificationSettings>({
    orderEnabled: true,
    promotionEnabled: true,
    inappEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    muteUntil: undefined
  })
  const [notiSaving, setNotiSaving] = useState<boolean>(false)

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    orderHistoryVisible: false,
    reviewsVisible: true
  });

  const toggleNotiSetting = (key: keyof INotificationSettings) => {
    setNotiSettings((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      const hasCategory = newState.orderEnabled || newState.promotionEnabled;
      const hasChannel = newState.inappEnabled || newState.emailEnabled || newState.smsEnabled;

      if (key === 'orderEnabled' || key === 'promotionEnabled') {
        if (!hasCategory) {
          return { ...newState, inappEnabled: false, emailEnabled: false, smsEnabled: false };
        }
        if (hasCategory && !hasChannel) {
          return { ...newState, inappEnabled: true };
        }
      }

      if (['inappEnabled', 'emailEnabled', 'smsEnabled'].includes(key)) {
        if (!hasChannel) {
          return { ...newState, orderEnabled: false, promotionEnabled: false }; // update here if there are more categories
        }
        if (hasChannel && !newState.orderEnabled) {
          return { ...newState, orderEnabled: true };
        }
      }

      return newState;
    });
  };

  const handleNotificationSave = async () => {
    try {
      setNotiSaving(true)
      const res = await apiUpdateNotificationSettings(notiSettings?.id!, notiSettings)
      if (res) {
        await fetchNotifications()
        toast(t('account.notificationUpdated'))
      }
    } catch (error) {
      toast(t('account.error'));
    } finally {
      setNotiSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage(t('account.passwordMismatch'));
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage(t('account.passwordLength'));
      setIsSaving(false);
      return;
    }

    try {
      await apiChangePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage(t('account.passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error instanceof ApiLocaleError ? t(error.errorKey) : t('account.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacySave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage(t('account.privacyUpdated'));
    } catch (error) {
      setMessage(t('account.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const fetchUserSettings = async () => {
    try {
      setLoading(true)
      const res = await apiGetNotificationSettings(user?.id!)
      setNotiSettings(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchUserSettings()
    }
  }, [user])

  return {
    loading,
    message,
    showCurrentPassword,
    passwordData,
    notiSettings,
    showNewPassword,
    showConfirmPassword,
    isSaving,
    privacy,
    user,
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
    setNotiSettings
  }
}
