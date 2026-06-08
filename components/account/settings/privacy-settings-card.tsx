import { Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { PrivacySettingsCardProps } from './settings-types';

export function PrivacySettingsCard({
  isSaving,
  privacy,
  t,
  handlePrivacySave,
  setPrivacy,
}: PrivacySettingsCardProps) {
  // TODO: relaunch later
  return (
    <Card className="hidden bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          {t('account.privacySettings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.publicProfile')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.publicProfileDesc')}</p>
            </div>
            <Switch
              checked={privacy.profileVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.orderHistory')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.orderHistoryDesc')}</p>
            </div>
            <Switch
              checked={privacy.orderHistoryVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, orderHistoryVisible: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-[#573e1c] font-medium">{t('account.productReviews')}</Label>
              <p className="text-sm text-[#8b6a42]">{t('account.productReviewsDesc')}</p>
            </div>
            <Switch
              checked={privacy.reviewsVisible}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, reviewsVisible: checked })}
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
            {t('account.saveSettings')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
