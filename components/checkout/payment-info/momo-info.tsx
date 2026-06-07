import { CheckCircle, Copy, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MomoAccountInfo } from '@/components/checkout/checkout-types';
import { CopyValueRow } from '@/components/checkout/payment-info/copy-value-row';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

interface MomoInfoProps {
  momoInfo: MomoAccountInfo;
  copiedField: string | null;
  total: number;
  onCopy: (text: string, field: string) => void;
}

export function MomoInfo({
  momoInfo,
  copiedField,
  total,
  onCopy,
}: MomoInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 mt-4 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
      <div className="flex items-center space-x-2 mb-4">
        <Smartphone className="w-5 h-5 text-pink-600" />
        <h3 className="font-semibold text-pink-800">{t('checkout.payment.momoInfo')}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <CopyValueRow
          label={t('checkout.payment.momoPhone')}
          value={momoInfo.phoneNumber}
          field="momoPhone"
          copiedField={copiedField}
          color="pink"
          onCopy={onCopy}
          isStrong
        />

        <CopyValueRow
          label={t('checkout.payment.momoName')}
          value={momoInfo.accountName}
          field="momoName"
          copiedField={copiedField}
          color="pink"
          onCopy={onCopy}
        />

        <div className="space-y-2">
          <Label className="text-pink-700 font-medium">{t('checkout.payment.momoAmount')}</Label>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-pink-900 font-bold text-lg">{formatCurrency(total)}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onCopy(total.toString(), 'momoAmount')}
              className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
            >
              {copiedField === 'momoAmount' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-100 rounded border-l-4 border-pink-500">
        <p className="text-pink-800 text-sm">
          <strong>{t('checkout.payment.momoGuide')}</strong>
        </p>
      </div>
    </div>
  );
}
