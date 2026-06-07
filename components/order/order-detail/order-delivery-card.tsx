import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/contexts/language-context';
import { OrderDetailBaseProps } from '@/components/order/order-detail/order-detail-types';

export function OrderDeliveryCard({ order }: OrderDetailBaseProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          {t('order.detail.deliveryInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-[#573e1c] mb-2">{t('order.detail.recipient')}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[#8b6a42]">{t('order.detail.name')}:</span>
              <span className="font-medium text-[#573e1c]">{order.receiverInfo?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#8b6a42]">{t('contact.info.phone')}:</span>
              <span className="text-[#573e1c]">{order.receiverInfo?.phone}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold text-[#573e1c] mb-2">{t('order.detail.address')}</h4>
          <p className="text-sm text-[#8b6a42] leading-relaxed">
            {order.shippingAddress}
          </p>
        </div>

        {order.notes && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-[#573e1c] mb-2">{t('order.detail.notes')}</h4>
              <p className="text-sm text-[#8b6a42] leading-relaxed">
                {order.notes}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
