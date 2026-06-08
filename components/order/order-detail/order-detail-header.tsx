import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/types';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatDate } from '@/lib/utils.date';
import { getOrderStatusColor } from '@/lib/utils.style';
import { OrderDetailBaseProps } from '@/components/order/order-detail/order-detail-types';

interface OrderDetailHeaderProps extends OrderDetailBaseProps {
  onBack: () => void;
}

export function OrderDetailHeader({
  order,
  onBack,
}: OrderDetailHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-4 lg:mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-[#573e1c] hover:bg-[#efe1c1]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('order.detail.back')}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('order.detail.title')} #{order.number}
          </h1>
          <p className="text-[#8b6a42] mt-2">
            {t('order.detail.placedOn')} {formatDate(order.createdAt!)}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge className={getOrderStatusColor(order.status!)}>
            {t(`account.status.${order.status}`)}
          </Badge>
          {order.status === OrderStatus.shipped && (
            <Badge variant="outline" className="border-blue-500 text-blue-600">
              {t('order.detail.estimatedDelivery')}: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('vi-VN') : ''}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
