import { Loader2 } from 'lucide-react';
import { OrderCard } from './order-card';
import { OrdersListProps } from './orders-page-types';

export function OrdersList({
  hasMore,
  loading,
  orders,
  t,
  loadMoreRef,
}: OrdersListProps) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} t={t} />
      ))}

      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-6 text-[#8b6a42] min-h-[50px]"
        >
          {loading && <Loader2 className="h-8 w-8 animate-spin" />}
        </div>
      )}
    </div>
  );
}
