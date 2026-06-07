import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentMethod } from '@/types';
import { useLanguage } from '@/lib/contexts/language-context';

interface PaymentMethodOptionsProps {
  paymentMethod?: PaymentMethod;
  onPaymentMethodChange: (value: PaymentMethod) => void;
}

export function PaymentMethodOptions({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodOptionsProps) {
  const { t } = useLanguage();

  return (
    <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
      <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
        <RadioGroupItem value={PaymentMethod.cash} id="cod" />
        <Label htmlFor="cod" className="flex-1 cursor-pointer">
          <div className="font-semibold text-[#573e1c]">{t('checkout.payment.cod')}</div>
          <div className="text-sm text-[#8b6a42]">{t('checkout.payment.codDesc')}</div>
        </Label>
      </div>

      <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
        <RadioGroupItem value={PaymentMethod.bankTransfer} id="banking" />
        <Label htmlFor="banking" className="flex-1 cursor-pointer">
          <div className="font-semibold text-[#573e1c]">{t('checkout.payment.banking')}</div>
          <div className="text-sm text-[#8b6a42]">{t('checkout.payment.bankingDesc')}</div>
        </Label>
      </div>

      <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
        <RadioGroupItem value={PaymentMethod.momo} id="momo" />
        <Label htmlFor="momo" className="flex-1 cursor-pointer">
          <div className="font-semibold text-[#573e1c]">{t('checkout.payment.momo')}</div>
          <div className="text-sm text-[#8b6a42]">{t('checkout.payment.momoDesc')}</div>
        </Label>
      </div>
    </RadioGroup>
  );
}
