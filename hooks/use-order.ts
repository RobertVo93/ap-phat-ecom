"use client"

import { useCart } from "@/lib/contexts/cart-context"
import { useLanguage } from "@/lib/contexts/language-context"
import { apiCancelOrder, apiGetGuestOrder, apiGetOrder } from "@/lib/httpclient/order.client"
import { IOrder } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"

type UseOrderOptions = {
  guestCustomerId?: string;
};

export const useOrder = (id: string, options: UseOrderOptions = {}) => {
  const { t } = useLanguage();
  const { addToCart } = useCart()
  const router = useRouter()

  const [order, setOrder] = useState<IOrder>()
  const [loading, setLoading] = useState<boolean>(false)
  const [notFoundError, setNotFoundError] = useState(false);
  const [reviewText, setReviewText] = useState('');

  const [rateOpen, setRateOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const getOrderHandler = async () => {
    try {
      setLoading(true)
      const res = options.guestCustomerId
        ? await apiGetGuestOrder(id, options.guestCustomerId)
        : await apiGetOrder(id)
      setOrder(res)
    } catch (e) {
      console.error(e)
      setNotFoundError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = () => {
    order?.items?.forEach(item => {
      addToCart(item.product!, item.quantity)
    });
    router.push('/cart')
  };

  const handleCancelOrder = async (id: string) => {
    try {
      const res = await apiCancelOrder(id)
      if (res) {
          setOrder(res)
          toast({
            description: t("order.detail.cancelSuccess"),
          })
      }

    } catch (e) {
      console.error(e)
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        description: t('order.detail.reviewRatingRequired'),
      });
      return;
    }

    try {
      // TODO: call API submit review

      toast({
        description: t('order.detail.reviewSuccess'),
      });

      setReviewText('');
      setRating(0);

      setRateOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description: t('common.somethingWentWrong'),
      });
    }
  };

  useEffect(() => {
    getOrderHandler()
  }, [id, options.guestCustomerId])

  return {
    loading,
    order,
    rating,
    reviewText,
    notFoundError,
    rateOpen,
    setRateOpen,
    t,
    handleCancelOrder,
    handleReorder,
    handleSubmitReview,
    setRating,
    setReviewText
  }
}
