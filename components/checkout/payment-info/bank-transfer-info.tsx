import { Building, CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PaymentAccountInfo } from '@/components/checkout/checkout-types';
import { CopyValueRow } from '@/components/checkout/payment-info/copy-value-row';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

interface BankTransferInfoProps {
  bankInfo: PaymentAccountInfo;
  copiedField: string | null;
  total: number;
  onCopy: (text: string, field: string) => void;
}

export function BankTransferInfo({
  bankInfo,
  copiedField,
  total,
  onCopy,
}: BankTransferInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2 mb-4">
        <Building className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800">{t('checkout.payment.bankInfo')}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label className="text-blue-700 font-medium">{t('checkout.payment.bankName')}</Label>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-blue-900 font-medium">{bankInfo.bankName}</span>
          </div>
        </div>

        <CopyValueRow
          label={t('checkout.payment.accountNumber')}
          value={bankInfo.accountNumber}
          field="accountNumber"
          copiedField={copiedField}
          color="blue"
          onCopy={onCopy}
          isStrong
        />

        <CopyValueRow
          label={t('checkout.payment.accountName')}
          value={bankInfo.accountName}
          field="accountName"
          copiedField={copiedField}
          color="blue"
          onCopy={onCopy}
        />

        <div className="space-y-2">
          <Label className="text-blue-700 font-medium">{t('checkout.payment.branch')}</Label>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-blue-900">{bankInfo.branch}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-blue-700 font-medium">{t('checkout.payment.amount')}</Label>
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <span className="text-blue-900 font-bold text-lg">{formatCurrency(total)}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onCopy(total.toString(), 'amount')}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              {copiedField === 'amount' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
        <p className="text-blue-800 text-sm">
          <strong>{t('checkout.payment.bankNote')}</strong>
        </p>
      </div>
    </div>
  );
}
