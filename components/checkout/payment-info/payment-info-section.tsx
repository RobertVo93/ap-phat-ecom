import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutPaymentSectionProps } from '@/components/checkout/checkout-types';
import { BankTransferInfo } from '@/components/checkout/payment-info/bank-transfer-info';
import { MomoInfo } from '@/components/checkout/payment-info/momo-info';
import { PaymentMethodOptions } from '@/components/checkout/payment-info/payment-method-options';
import { useLanguage } from '@/lib/contexts/language-context';
import { PaymentMethod } from '@/types';

export function PaymentInfoSection({
  paymentMethod,
  copiedField,
  total,
  bankInfo,
  momoInfo,
  onPaymentMethodChange,
  onCopy,
}: CheckoutPaymentSectionProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          {t('checkout.paymentInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentMethodOptions
          paymentMethod={paymentMethod}
          onPaymentMethodChange={onPaymentMethodChange}
        />

        {paymentMethod === PaymentMethod.bankTransfer && (
          <BankTransferInfo
            bankInfo={bankInfo}
            copiedField={copiedField}
            total={total}
            onCopy={onCopy}
          />
        )}

        {paymentMethod === PaymentMethod.momo && (
          <MomoInfo
            momoInfo={momoInfo}
            copiedField={copiedField}
            total={total}
            onCopy={onCopy}
          />
        )}
      </CardContent>
    </Card>
  );
}
