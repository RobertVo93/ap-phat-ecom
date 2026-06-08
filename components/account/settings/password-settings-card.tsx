import { Eye, EyeOff, Save, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordSettingsCardProps } from './settings-types';

export function PasswordSettingsCard({
  isSaving,
  passwordData,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  t,
  handlePasswordChange,
  setPasswordData,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,
}: PasswordSettingsCardProps) {
  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          {t('account.changePassword')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-[#573e1c]">{t('account.currentPassword')}</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(event) => setPasswordData({ ...passwordData, currentPassword: event.target.value })}
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
              <Label htmlFor="newPassword" className="text-[#573e1c]">{t('account.newPassword')}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(event) => setPasswordData({ ...passwordData, newPassword: event.target.value })}
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
              <Label htmlFor="confirmPassword" className="text-[#573e1c]">{t('account.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(event) => setPasswordData({ ...passwordData, confirmPassword: event.target.value })}
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
              {isSaving ? t('account.saving') : t('account.changePassword')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
