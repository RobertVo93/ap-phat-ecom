import { OrderDetailBaseProps } from '@/components/order/order-detail/order-detail-types';
import { OrderDeliveryCard } from '@/components/order/order-detail/order-delivery-card';
import { OrderSummaryCard } from '@/components/order/order-detail/order-summary-card';
import { OrderSupportCard } from '@/components/order/order-detail/order-support-card';

export function OrderDetailSidebar({ order }: OrderDetailBaseProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <OrderSummaryCard order={order} />
      <OrderDeliveryCard order={order} />
      <OrderSupportCard />
    </div>
  );
}
