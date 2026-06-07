import Link from 'next/link';
import { Eye, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderItemRow } from '@/components/order/order-detail';
import { formatCurrency } from '@/lib/utils.currency';
import { getOrderStatusColor } from '@/lib/utils.style';
import { formatDate } from '@/lib/utils';
import { OrderCardProps } from './orders-page-types';

export function OrderCard({ order, t }: OrderCardProps) {
  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-center text-[#573e1c]">
              <Package className="w-5 h-5 mr-2" />
              #{order.number}
            </CardTitle>
            <p className="text-sm text-[#8b6a42]">
              {formatDate(order.createdAt!)}
            </p>
          </div>
          <Badge
            className={getOrderStatusColor(order.status || 'pending')}
          >
            {t(`account.status.${order.status}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {order.items?.map((item, index) => (
            <OrderItemRow key={item.id ?? index} item={item} />
          ))}
        </div>

        {order.notes && (
          <div className="flex justify-between py-2 border-b last:border-b-0">
            <span className="font-semibold">
              {t('account.orderNote')}:
            </span>
            <span>{order.notes}</span>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <span className="font-semibold">
            {t('account.total').replace(
              '{amount}',
              formatCurrency(order.totalAmount || 0)
            )}
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
          >
            <Link href={`/account/orders/${order.id}`}>
              <Eye className="w-3 h-3 mr-1" />
              {t('account.orderDetails')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
