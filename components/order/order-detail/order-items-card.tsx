import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/contexts/language-context';
import { OrderDetailBaseProps } from '@/components/order/order-detail/order-detail-types';
import { OrderItemRow } from '@/components/order/order-detail/order-item-row';

export function OrderItemsCard({ order }: OrderDetailBaseProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c]">{t('order.detail.items')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items?.map((item, index) => (
            <OrderItemRow key={item.id ?? index} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
