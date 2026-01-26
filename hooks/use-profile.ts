"use client"

import { useAuth } from "@/lib/contexts/auth-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { apiUpdateProfile } from "@/lib/httpclient/profile.client";
import { base64ToFile } from "@/lib/utils";
import { Gender, IProfile, IUser } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3";

export const useProfile = () => {
  const { t } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState<IProfile>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    gender: Gender.male
  });

  const onCancel = () => {
    setFormData({
      username: user?.username!,
      fullName: user?.fullName!,
      email: user?.email!,
      phone: user?.phone!,
      avatar: user?.avatar,
      gender: user?.gender,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await apiUpdateProfile(user?.id!, formData)
      if (res) {
        toast.success(t('account.updateSuccess'))
        updateProfile(res)
      }
    } catch (error) {
      toast.error(t('account.error'))
    } finally {
      setIsSaving(false);
    }
  }

  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      setLoading(true)
      if (avatarUrl.startsWith("data:")) {
        // Convert base64 to File
        const file = base64ToFile(avatarUrl, "avatar-image.png");

        // Upload to S3
        const s3Url = await uploadFileToS3(file, "avatars");
        const updated: IUser = { ...formData, avatar: s3Url }

        // Updated avatar
        const res = await apiUpdateProfile(user?.id!, updated)
        setFormData(res)
        updateProfile(res)
        toast.success(t('account.avatarUpdated'))

        // Delete old image on S3
        if (formData.avatar) {
          await deleteFileFromS3(formData.avatar)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        gender: user.gender || Gender.male,
      })
    }
  }, [user])

  return {
    formData,
    user,
    isSaving,

    t,
    setFormData,
    handleSubmit,
    handleAvatarChange,
    onCancel,
  }
}