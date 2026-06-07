import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';
import { env } from '@/constants';

interface CartOrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

export function CartOrderSummary({
  subtotal,
  tax,
  total,
}: CartOrderSummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="lg:col-span-1">
      <Card className="bg-white border-[#d4c5a0] sticky top-24">
        <CardHeader>
          <CardTitle className="text-[#573e1c]">{t('cart.order.summary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#8b6a42]">{t('cart.subtotal')}</span>
              <span className="font-semibold text-[#573e1c]">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8b6a42]">{t('cart.tax')} ({env.NEXT_PUBLIC_TAX_RATE}%)</span>
              <span className="font-semibold text-[#573e1c]">
                {formatCurrency(tax)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
              <span className="font-semibold text-[#573e1c]">?</span>
            </div>
            <div className="text-sm text-[#8b6a42] bg-[#efe1c1] p-2 rounded">
              {t('cart.shipping.fee')}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span className="text-[#573e1c]">{t('cart.total')}</span>
            <span className="text-[#573e1c]">{formatCurrency(total)}</span>
          </div>

          <Button
            asChild
            className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold"
          >
            <Link href="/checkout">
              {t('cart.checkout')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
