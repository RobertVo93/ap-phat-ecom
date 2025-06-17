'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Copy, 
  Download,
  MessageCircle,
  Star,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// import { Progress } from '@/components/ui/progress';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Order } from '@/lib/types';
import Image from 'next/image';

interface OrderDetailClientProps {
  order: Order;
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const { t } = useLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'shipping': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return t(`order.status.${status}`);
  };

  const getProgressPercentage = useMemo(() => {
    // const completedSteps = order.timeline.filter(step => step.completed).length;
    // return (completedSteps / order.timeline.length) * 100;
    return 0;
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleReorder = () => {
    alert(t('order.detail.reorderSuccess'));
  };

  const handleCancelOrder = () => {
    if (confirm(t('order.detail.cancelConfirm'))) {
      alert(t('order.detail.cancelSuccess'));
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert(t('order.detail.reviewRatingRequired'));
      return;
    }
    alert(t('order.detail.reviewSuccess'));
    setReviewText('');
    setRating(0);
  };

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
              <Link href="/account/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('order.detail.back')}
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
                {t('order.detail.title')} #{order.orderNumber}
              </h1>
              <p className="text-[#8b6a42] mt-2">
                {t('order.detail.placedOn')} {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
              {order.status === 'shipping' && (
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
            {/* Order Progress */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  {t('order.detail.status')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8b6a42]">Tiến độ</span>
                    <span className="text-[#573e1c] font-medium">
                      {Math.round(getProgressPercentage)}%
                    </span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div> */}

                <div className="space-y-4">
                  {order.timeline?.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed 
                          ? 'bg-[#573e1c] text-[#efe1c1]' 
                          : 'bg-gray-200 text-gray-500'
                      } ${step.current ? 'ring-4 ring-[#573e1c] ring-opacity-20' : ''}`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          step.completed ? 'text-[#573e1c]' : 'text-gray-500'
                        }`}>
                          {t(`order.timeline.${step.title}`)}
                        </h4>
                        <p className="text-sm text-[#8b6a42] mt-1">
                          {step.description}
                        </p>
                        {step.timestamp && (
                          <p className="text-xs text-[#8b6a42] mt-1">
                            {formatDate(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Information */}
                {order.status === 'shipping' && (
                  <div className="mt-6 p-4 bg-[#f8f5f0] rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-[#573e1c] flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        {t('order.detail.shippingInfo')}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#8b6a42]">{t('order.detail.carrier')}:</span>
                        <p className="font-medium text-[#573e1c]">{order.carrier}</p>
                      </div>
                      <div>
                        <span className="text-[#8b6a42]">{t('order.detail.trackingNumber')}:</span>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono font-medium text-[#573e1c]">{order.trackingNumber}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(order?.trackingNumber || '', 'tracking')}
                            className="h-6 w-6 p-0 text-[#8b6a42] hover:text-[#573e1c]"
                          >
                            {copiedField === 'tracking' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                    >
                      <Truck className="w-3 h-3 mr-1" />
                      {t('order.detail.trackPackage')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('order.detail.items')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-[#efe1c1] rounded-lg">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#573e1c]">{item.product.name}</h4>
                        <p className="text-sm text-[#8b6a42] mt-1">{item.selectedVariant?.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-[#8b6a42]">
                            {t('cart.quantity')}: {item.quantity}
                          </span>
                          <span className="font-semibold text-[#573e1c]">
                            {formatPrice(item.product.price * item.quantity)}
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

                  {order.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      onClick={handleCancelOrder}
                      className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {t('order.detail.cancel')}
                    </Button>
                  )}

                  {order.status === 'delivered' && (
                    <Dialog>
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
                                  className={`w-8 h-8 ${
                                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
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
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.tax')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatPrice(order.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {order.shipping === 0 ? t('cart.free') : formatPrice(order.shipping)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#573e1c]">{t('cart.total')}</span>
                  <span className="text-[#573e1c]">{formatPrice(order.total)}</span>
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
                      <span className="font-medium text-[#573e1c]">{order.deliveryAddress.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-[#8b6a42]" />
                      <span className="text-[#573e1c]">{order.deliveryAddress.phone}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-[#573e1c] mb-2">{t('order.detail.address')}</h4>
                  <p className="text-sm text-[#8b6a42] leading-relaxed">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.ward}, {order.deliveryAddress.district}<br />
                    {order.deliveryAddress.city}
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