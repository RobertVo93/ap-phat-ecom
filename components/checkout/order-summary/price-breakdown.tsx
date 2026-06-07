import { env } from '@/constants';
import { DiscountCalculation } from '@/components/checkout/checkout-types';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

interface PriceBreakdownProps {
  subtotal: number;
  tax: number;
  shipping: number;
  discountCalculation: DiscountCalculation;
}

export function PriceBreakdown({
  subtotal,
  tax,
  shipping,
  discountCalculation,
}: PriceBreakdownProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-[#8b6a42]">{t('cart.subtotal')}</span>
        <span className="font-semibold text-[#573e1c]">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {discountCalculation.voucherDiscount > 0 && (
        <div className="flex justify-between">
          <span className="text-green-600">{t('checkout.voucher.discount')}</span>
          <span className="font-semibold text-green-600">
            -{formatCurrency(discountCalculation.voucherDiscount)}
          </span>
        </div>
      )}

      {discountCalculation.pointsDiscount > 0 && (
        <div className="flex justify-between">
          <span className="text-blue-600">{t('checkout.points.discount')}</span>
          <span className="font-semibold text-blue-600">
            -{formatCurrency(discountCalculation.pointsDiscount)}
          </span>
        </div>
      )}

      <div className="flex justify-between">
        <span className="text-[#8b6a42]">{t('cart.tax')} ({env.NEXT_PUBLIC_TAX_RATE}%)</span>
        <span className="font-semibold text-[#573e1c]">
          {formatCurrency(tax)}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
        <span className="font-semibold text-[#573e1c]">
          {shipping ? formatCurrency(shipping) : '?'}
        </span>
      </div>
    </div>
  );
}
