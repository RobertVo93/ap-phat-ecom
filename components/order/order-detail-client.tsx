'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Download,
  MessageCircle,
  Star,
  RotateCcw,
  ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OrderStatus } from '@/types';
import Image from 'next/image';
import { formatDate } from '@/lib/utils.date';
import { getOrderStatusColor } from '@/lib/utils.style';
import { formatCurrencyVND } from '@/lib/utils.currency';
import { notFound, useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-order';
import { LoadingOverlay } from '../common/LoadOverlay';
import { OrderCancelDialog } from './order-cancel-dialog';

export function OrderDetailClient({ id }: { id: string }) {
  const {
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
  } = useOrder(id)
  const router = useRouter()

  if (loading) return <LoadingOverlay loading />

  if (notFoundError) return notFound()

  if (!order) return null

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              asChild
              variant="ghost"
              className="text-[#573e1c] hover:bg-[#efe1c1]"
            >
              <div onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('order.detail.back')}
              </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('order.detail.items')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-[#efe1c1] rounded-lg">
                      {item.product?.image ?
                        <Image
                          src={item.product.image}
                          alt={item.product.name!}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        /> :
                        <ImageIcon className="w-[64px] h-[64px] text-gray-400" />
                      }

                      <div className="flex-1">
                        <h4 className="font-semibold text-[#573e1c]">{item.product?.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-[#8b6a42]">
                            {t('cart.quantity')}: {item.quantity}
                          </span>
                          <span className="font-semibold text-[#573e1c]">
                            {formatCurrencyVND(item.totalCost!)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('order.detail.actions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleReorder}
                    className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('order.detail.reorder')}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('order.detail.downloadInvoice')}
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('order.detail.contactSupport')}
                  </Button>

                  {order.status === OrderStatus.pending && (
                    <OrderCancelDialog handleCancelOrder={handleCancelOrder} id={order.id!} />
                  )}

                  {order.status === OrderStatus.completed && (
                    <Dialog open={rateOpen} onOpenChange={setRateOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          {t('order.detail.review')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-[#573e1c]">{t('order.detail.review')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-[#573e1c]">{t('order.detail.yourRating')}</Label>
                            <div className="flex items-center space-x-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRating(star)}
                                  className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                >
                                  <Star className="w-full h-full fill-current" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="review" className="text-[#573e1c]">{t('order.detail.comments')}</Label>
                            <Textarea
                              id="review"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder={t('order.detail.reviewPlaceholder')}
                              className="mt-2 border-[#8b6a42] focus:border-[#573e1c]"
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              className="border-[#573e1c] text-[#573e1c]"
                              onClick={() => setRateOpen(false)}
                            >
                              {t('common.cancel')}
                            </Button>
                            <Button
                              onClick={handleSubmitReview}
                              className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                            >
                              {t('order.detail.reviewSubmit')}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('order.detail.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.subtotal')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatCurrencyVND(order.totalAmount!)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.tax')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatCurrencyVND(order.tax!)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatCurrencyVND(order.shippingFee!)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#573e1c]">{t('cart.total')}</span>
                  <span className="text-[#573e1c]">{formatCurrencyVND(order.totalAmount!)}</span>
                </div>

                <div className="text-sm text-[#8b6a42]">
                  <strong>{t('order.detail.paymentMethod')}:</strong>
                  <br />
                  {t(`payment.method.${order.paymentMethod}`)}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
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

            {/* Customer Service */}
            <Card className="bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] border-[#8b6a42]">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-[#573e1c] text-lg mb-3">
                  {t('order.detail.needHelp')}
                </h3>
                <p className="text-[#8b6a42] text-sm mb-4">
                  {t('order.detail.contactUs')}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-[#573e1c]" />
                    <span className="text-[#573e1c] font-medium">028 3823 4567</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-[#573e1c]" />
                    <span className="text-[#573e1c] font-medium">support@ricepaperstore.vn</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="mt-4 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {t('order.detail.chatNow')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}