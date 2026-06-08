import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';
import { OrderDetailBaseProps } from '@/components/order/order-detail/order-detail-types';
import { Badge } from '@/components/ui/badge';

export function OrderSummaryCard({ order }: OrderDetailBaseProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c]">{t('order.detail.summary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[#8b6a42]">{t('cart.subtotal')}</span>
            <span className="font-semibold text-[#573e1c]">
              {formatCurrency(order.totalAmount!)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b6a42]">{t('cart.tax')}</span>
            <span className="font-semibold text-[#573e1c]">
              {formatCurrency(order.tax!)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
            <span className="font-semibold text-[#573e1c]">
              {formatCurrency(order.shippingFee!)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span className="text-[#573e1c]">{t('cart.total')}</span>
          <span className="text-[#573e1c]">{formatCurrency(order.totalAmount!)}</span>
        </div>

        <div className="flex justify-between text-sm text-[#8b6a42]">
          <strong>{t('order.detail.paymentMethod')}: </strong>
          <Badge className="bg-green-100 text-green-800">
            {t(`payment.method.${order.paymentMethod}`)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
