'use client';

import { notFound, useRouter } from 'next/navigation';
import {
  OrderActionsCard,
  OrderDetailHeader,
  OrderDetailSidebar,
  OrderItemsCard,
} from '@/components/order/order-detail';
import { LoadingOverlay } from '@/components/common/LoadOverlay';
import { useOrder } from '@/hooks/use-order';
import { getLocalCustomer } from '@/lib/utils.localStorage';

interface OrderDetailClientProps {
  id: string;
  isGuestView?: boolean;
}

export function OrderDetailClient({ id, isGuestView = false }: OrderDetailClientProps) {
  const {
    loading,
    order,
    rating,
    reviewText,
    notFoundError,
    rateOpen,
    setRateOpen,
    handleCancelOrder,
    handleReorder,
    handleSubmitReview,
    setRating,
    setReviewText,
  } = useOrder(id, { guestCustomerId: isGuestView ? getLocalCustomer().id : undefined});
  const router = useRouter();

  if (loading) return <LoadingOverlay loading />;

  if (notFoundError) return notFound();

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderDetailHeader order={order} onBack={() => router.back()} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsCard order={order} />
            {!isGuestView && (
              <OrderActionsCard
                order={order}
                rating={rating}
                reviewText={reviewText}
                rateOpen={rateOpen}
                setRateOpen={setRateOpen}
                setRating={setRating}
                setReviewText={setReviewText}
                onCancelOrder={handleCancelOrder}
                onReorder={handleReorder}
                onSubmitReview={handleSubmitReview}
              />
            )}
          </div>

          <OrderDetailSidebar order={order} />
        </div>
      </div>
    </div>
  );
}
