import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckoutOrderSummaryProps } from '@/components/checkout/checkout-types';
import { CheckoutItemsList } from '@/components/checkout/order-summary/checkout-items-list';
import { LoyaltyPointsSection } from '@/components/checkout/order-summary/loyalty-points-section';
import { PriceBreakdown } from '@/components/checkout/order-summary/price-breakdown';
import { TermsSection } from '@/components/checkout/order-summary/terms-section';
import { VoucherSection } from '@/components/checkout/order-summary/voucher-section';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

export function CheckoutOrderSummary({
  items,
  subtotal,
  tax,
  shipping,
  total,
  agreeTerms,
  voucherCode,
  voucherError,
  appliedVoucher,
  pointsToRedeem,
  discountCalculation,
  loyaltyPoints,
  onVoucherCodeChange,
  onApplyVoucher,
  onRemoveVoucher,
  onPointsChange,
  onAgreeTermsChange,
}: CheckoutOrderSummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white border-[#d4c5a0] sticky top-24">
        <CardHeader>
          <CardTitle className="text-[#573e1c]">{t('checkout.orderSummary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CheckoutItemsList items={items} />

          <Separator className="hidden" />

          <VoucherSection
            voucherCode={voucherCode}
            voucherError={voucherError}
            appliedVoucher={appliedVoucher}
            discountCalculation={discountCalculation}
            onVoucherCodeChange={onVoucherCodeChange}
            onApplyVoucher={onApplyVoucher}
            onRemoveVoucher={onRemoveVoucher}
          />

          <LoyaltyPointsSection
            loyaltyPoints={loyaltyPoints}
            pointsToRedeem={pointsToRedeem}
            subtotal={subtotal}
            discountCalculation={discountCalculation}
            onPointsChange={onPointsChange}
          />

          <Separator />

          <PriceBreakdown
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            discountCalculation={discountCalculation}
          />

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span className="text-[#573e1c]">{t('cart.total')}</span>
            <span className="text-[#573e1c]">{formatCurrency(total)}</span>
          </div>

          <TermsSection
            agreeTerms={agreeTerms}
            onAgreeTermsChange={onAgreeTermsChange}
          />

          <Button
            type="submit"
            className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300"
          >
            {t('checkout.placeOrder')}
          </Button>

          <div className="text-center text-xs text-[#8b6a42]">
            {t('checkout.security')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
