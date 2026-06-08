import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderCancelDialog } from '@/components/order/order-cancel-dialog';
import { OrderStatus } from '@/types';
import { useLanguage } from '@/lib/contexts/language-context';
import { OrderDetailActionsProps } from '@/components/order/order-detail/order-detail-types';
import { OrderReviewDialog } from '@/components/order/order-detail/order-review-dialog';

export function OrderActionsCard({
  order,
  rating,
  reviewText,
  rateOpen,
  setRateOpen,
  setRating,
  setReviewText,
  onCancelOrder,
  onReorder,
  onSubmitReview,
}: OrderDetailActionsProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardHeader>
        <CardTitle className="text-[#573e1c]">{t('order.detail.actions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onReorder}
            className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('order.detail.reorder')}
          </Button>

          <Button
            variant="outline"
            className="hidden border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('order.detail.downloadInvoice')}
          </Button>

          {order.status === OrderStatus.pending && (
            <OrderCancelDialog handleCancelOrder={onCancelOrder} id={order.id!} />
          )}

          {order.status === OrderStatus.completed && (
            <OrderReviewDialog
              open={rateOpen}
              rating={rating}
              reviewText={reviewText}
              onOpenChange={setRateOpen}
              onRatingChange={setRating}
              onReviewTextChange={setReviewText}
              onSubmitReview={onSubmitReview}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
