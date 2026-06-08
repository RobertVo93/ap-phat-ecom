import { Dispatch, FormEvent, SetStateAction } from 'react';
import { INotificationSettings } from '@/types';

export type SettingsTranslator = (key: string) => string;

export interface IPasswordSettingsForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IPrivacySettingsForm {
  profileVisible: boolean;
  orderHistoryVisible: boolean;
  reviewsVisible: boolean;
}

export interface AccountSettingsHeaderProps {
  t: SettingsTranslator;
}

export interface SettingsMessageProps {
  message: string;
  t: SettingsTranslator;
}

export interface PasswordSettingsCardProps {
  isSaving: boolean;
  passwordData: IPasswordSettingsForm;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  t: SettingsTranslator;
  handlePasswordChange: (event: FormEvent) => void;
  setPasswordData: Dispatch<SetStateAction<IPasswordSettingsForm>>;
  setShowCurrentPassword: Dispatch<SetStateAction<boolean>>;
  setShowNewPassword: Dispatch<SetStateAction<boolean>>;
  setShowConfirmPassword: Dispatch<SetStateAction<boolean>>;
}

export interface NotificationSettingsCardProps {
  notiSaving: boolean;
  notiSettings: INotificationSettings | null | undefined;
  t: SettingsTranslator;
  handleNotificationSave: () => void;
  setNotiSettings: Dispatch<SetStateAction<INotificationSettings>>;
  toggleNotiSetting: (key: keyof INotificationSettings) => void;
}

export interface PrivacySettingsCardProps {
  isSaving: boolean;
  privacy: IPrivacySettingsForm;
  t: SettingsTranslator;
  handlePrivacySave: () => void;
  setPrivacy: Dispatch<SetStateAction<IPrivacySettingsForm>>;
}
