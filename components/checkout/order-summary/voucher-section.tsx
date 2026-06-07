import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DiscountCalculation } from '@/components/checkout/checkout-types';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

interface VoucherSectionProps {
  voucherCode: string;
  voucherError: string;
  appliedVoucher: string | null;
  discountCalculation: DiscountCalculation;
  onVoucherCodeChange: (value: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
}

export function VoucherSection({
  voucherCode,
  voucherError,
  appliedVoucher,
  discountCalculation,
  onVoucherCodeChange,
  onApplyVoucher,
  onRemoveVoucher,
}: VoucherSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="hidden space-y-3">
      <h4 className="font-semibold text-[#573e1c] flex items-center">
        <Gift className="w-4 h-4 mr-2" />
        {t('checkout.voucher.title')}
      </h4>

      {!appliedVoucher ? (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              value={voucherCode}
              onChange={(e) => onVoucherCodeChange(e.target.value)}
              placeholder={t('checkout.voucher.placeholder')}
              className="border-[#8b6a42] focus:border-[#573e1c]"
            />
            <Button
              type="button"
              onClick={onApplyVoucher}
              variant="outline"
              className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
            >
              {t('checkout.voucher.apply')}
            </Button>
          </div>
          {voucherError && (
            <p className="text-sm text-red-600">{voucherError}</p>
          )}
        </div>
      ) : (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-800">{appliedVoucher}</p>
              <p className="text-sm text-green-600">
                -{formatCurrency(discountCalculation.voucherDiscount)}
              </p>
            </div>
            <Button
              type="button"
              onClick={onRemoveVoucher}
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-800"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
