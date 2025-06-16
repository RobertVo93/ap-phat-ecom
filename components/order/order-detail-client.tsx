'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Order } from '@/lib/types';

interface OrderDetailClientProps {
  order: Order;
}

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const { t } = useLanguage();
  const params = useParams();
  const orderId = params.id as string;
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  // Mock order data - in real app, fetch from API
  const order = {
    id: orderId,
    orderNumber: `ORD-${orderId}`,
    date: '2024-01-15T10:30:00Z',
    status: 'shipping',
    estimatedDelivery: '2024-01-17',
    trackingNumber: 'VN123456789',
    carrier: 'Giao Hàng Nhanh',
    customer: {
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      phone: '0901234567'
    },
    deliveryAddress: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      street: '123 Đường Lê Lợi',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP.HCM'
    },
    items: [
      {
        id: '1',
        name: 'Bánh Tráng Nướng Tây Ninh',
        variant: 'Gói lớn - 40 tờ',
        quantity: 2,
        price: 45000,
        image: 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg'
      },
      {
        id: '2',
        name: 'Bánh Phở Hà Nội',
        variant: 'Bánh phở nhỏ - 500g',
        quantity: 3,
        price: 15000,
        image: 'https://images.pexels.com/photos/4331521/pexels-photo-4331521.jpeg'
      }
    ],
    pricing: {
      subtotal: 135000,
      tax: 13500,
      shipping: 0,
      total: 148500
    },
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    notes: 'Giao hàng vào buổi chiều, gọi trước 15 phút',
    timeline: [
      {
        status: 'confirmed',
        title: 'Đơn hàng đã được xác nhận',
        description: 'Chúng tôi đã nhận và xác nhận đơn hàng của bạn',
        timestamp: '2024-01-15T10:30:00Z',
        completed: true
      },
      {
        status: 'preparing',
        title: 'Đang chuẩn bị hàng',
        description: 'Đơn hàng đang được đóng gói và chuẩn bị giao',
        timestamp: '2024-01-15T14:00:00Z',
        completed: true
      },
      {
        status: 'shipping',
        title: 'Đang giao hàng',
        description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
        timestamp: '2024-01-16T09:00:00Z',
        completed: true,
        current: true
      },
      {
        status: 'delivered',
        title: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao thành công',
        timestamp: null,
        completed: false
      }
    ]
  };

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
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'shipping': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = order.timeline.filter(step => step.completed).length;
    return (completedSteps / order.timeline.length) * 100;
  };

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
    // Add items back to cart
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleCancelOrder = () => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      alert('Đơn hàng đã được hủy thành công!');
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }
    alert('Cảm ơn bạn đã đánh giá!');
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
                Quay lại đơn hàng
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
                Chi tiết đơn hàng #{order.orderNumber}
              </h1>
              <p className="text-[#8b6a42] mt-2">
                Đặt ngày {formatDate(order.date)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Badge>
              {order.status === 'shipping' && (
                <Badge variant="outline" className="border-blue-500 text-blue-600">
                  Dự kiến giao: {new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}
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
                  Trạng thái đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8b6a42]">Tiến độ</span>
                    <span className="text-[#573e1c] font-medium">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="space-y-4">
                  {order.timeline.map((step, index) => (
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
                          {step.title}
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
                        Thông tin vận chuyển
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#8b6a42]">Đơn vị vận chuyển:</span>
                        <p className="font-medium text-[#573e1c]">{order.carrier}</p>
                      </div>
                      <div>
                        <span className="text-[#8b6a42]">Mã vận đơn:</span>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono font-medium text-[#573e1c]">{order.trackingNumber}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(order.trackingNumber, 'tracking')}
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
                      Theo dõi chi tiết
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">Sản phẩm đã đặt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-[#efe1c1] rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#573e1c]">{item.name}</h4>
                        <p className="text-sm text-[#8b6a42] mt-1">{item.variant}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-[#8b6a42]">
                            Số lượng: {item.quantity}
                          </span>
                          <span className="font-semibold text-[#573e1c]">
                            {formatPrice(item.price * item.quantity)}
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
                <CardTitle className="text-[#573e1c]">Thao tác</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleReorder}
                    className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Mua lại
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Tải hóa đơn
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>

                  {order.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      onClick={handleCancelOrder}
                      className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Hủy đơn hàng
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
                          Đánh giá
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-[#573e1c]">Đánh giá đơn hàng</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-[#573e1c]">Đánh giá của bạn</Label>
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
                            <Label htmlFor="review" className="text-[#573e1c]">Nhận xét</Label>
                            <Textarea
                              id="review"
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm và dịch vụ..."
                              className="mt-2 border-[#8b6a42] focus:border-[#573e1c]"
                              rows={4}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              className="border-[#573e1c] text-[#573e1c]"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleSubmitReview}
                              className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                            >
                              Gửi đánh giá
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
                <CardTitle className="text-[#573e1c]">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Tạm tính</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatPrice(order.pricing.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Thuế VAT</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatPrice(order.pricing.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Phí vận chuyển</span>
                    <span className="font-semibold text-[#573e1c]">
                      {order.pricing.shipping === 0 ? 'Miễn phí' : formatPrice(order.pricing.shipping)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#573e1c]">Tổng cộng</span>
                  <span className="text-[#573e1c]">{formatPrice(order.pricing.total)}</span>
                </div>

                <div className="text-sm text-[#8b6a42]">
                  <strong>Phương thức thanh toán:</strong>
                  <br />
                  {order.paymentMethod}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#573e1c] mb-2">Người nhận</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#8b6a42]">Tên:</span>
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
                  <h4 className="font-semibold text-[#573e1c] mb-2">Địa chỉ</h4>
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
                      <h4 className="font-semibold text-[#573e1c] mb-2">Ghi chú</h4>
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
                  Cần hỗ trợ?
                </h3>
                <p className="text-[#8b6a42] text-sm mb-4">
                  Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về đơn hàng
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
                  Chat ngay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}