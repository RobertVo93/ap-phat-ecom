import { Bell, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { env } from '@/constants/env';
import { NotificationSettingsCardProps } from './settings-types';

export function NotificationSettingsCard({
  notiSaving,
  notiSettings,
  t,
  handleNotificationSave,
  setNotiSettings,
  toggleNotiSetting,
}: NotificationSettingsCardProps) {
  // TODO: reload later
  if (!notiSettings) return null;

  const minMuteDate = new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('sv-SE');
  const muteUntilValue = notiSettings.muteUntil
    ? new Date(notiSettings.muteUntil).toLocaleDateString('sv-SE')
    : '';

  return (
    <Card className="hidden bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          {t('account.notificationSettings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.orderUpdates')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.orderUpdatesDesc')}</p>
            </div>
            <Switch
              checked={notiSettings.orderEnabled}
              onCheckedChange={() => toggleNotiSetting('orderEnabled')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.promotions')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.promotionsDesc')}</p>
            </div>
            <Switch
              checked={notiSettings.promotionEnabled}
              onCheckedChange={() => toggleNotiSetting('promotionEnabled')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.inapp')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.inappDesc')}</p>
            </div>
            <Switch
              checked={notiSettings.inappEnabled}
              onCheckedChange={() => toggleNotiSetting('inappEnabled')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.sms')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.smsDesc')}</p>
            </div>
            <Switch
              disabled={!env.SMS_KEY}
              checked={notiSettings.smsEnabled}
              onCheckedChange={() => toggleNotiSetting('smsEnabled')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.emailMessages')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.emailDesc')}</p>
            </div>
            <Switch
              disabled={!env.EMAIL_KEY}
              checked={notiSettings.emailEnabled}
              onCheckedChange={() => toggleNotiSetting('emailEnabled')}
            />
          </div>

          <Separator />
        </div>

        <div>
          <Label className="text-[#573e1c] font-medium">{t('account.muteUntil')}</Label>
          <Input
            type="date"
            className="w-[150px]"
            min={minMuteDate}
            value={muteUntilValue}
            onChange={(event) => {
              const dateValue = event.target.value;
              setNotiSettings({
                ...notiSettings,
                muteUntil: dateValue ? new Date(dateValue) : undefined,
              });
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNotificationSave}
            disabled={notiSaving}
            className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('account.saveSettings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
