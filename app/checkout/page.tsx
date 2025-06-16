'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, Calendar, Clock, FileText, Copy, CheckCircle, Building, Smartphone } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

export default function CheckoutPage() {
  const { language, t } = useLanguage();
  const { items, getCartTotal } = useCart();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    ward: '',
    district: '',
    city: 'TP.HCM',
    deliveryDate: '',
    deliveryTime: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100000 ? 0 : 25000;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = () => {
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }
    
    // Here you would typically send the order to your backend
    alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
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

  // Bank and MoMo account information
  const bankInfo = {
    bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
    accountNumber: '0123456789',
    accountName: 'CONG TY TNHH RICE & NOODLES',
    branch: 'Chi nhánh Sài Gòn'
  };

  const momoInfo = {
    phoneNumber: '0901234567',
    accountName: 'Rice & Noodles Store'
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
            Giỏ hàng trống
          </h2>
          <p className="text-[#8b6a42] mb-8">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
          </p>
          <Button
            asChild
            className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
          >
            <Link href="/products">
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>
      </div>
    );
  }

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
              <Link href="/cart">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại giỏ hàng
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('checkout.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('checkout.customerInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#573e1c]">Họ và tên *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#573e1c]">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#573e1c]">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  {t('checkout.deliveryInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#573e1c]">Địa chỉ *</Label>
                  <Input
                    id="address"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder="Số nhà, tên đường"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ward" className="text-[#573e1c]">Phường/Xã *</Label>
                    <Input
                      id="ward"
                      value={deliveryInfo.ward}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, ward: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-[#573e1c]">Quận/Huyện *</Label>
                    <Input
                      id="district"
                      value={deliveryInfo.district}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, district: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[#573e1c]">Tỉnh/Thành phố *</Label>
                    <Select value={deliveryInfo.city} onValueChange={(value) => setDeliveryInfo({...deliveryInfo, city: value})}>
                      <SelectTrigger className="border-[#8b6a42]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TP.HCM">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="Hanoi">Hà Nội</SelectItem>
                        <SelectItem value="Danang">Đà Nẵng</SelectItem>
                        <SelectItem value="Cantho">Cần Thơ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate" className="text-[#573e1c] flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Ngày giao hàng
                    </Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryInfo.deliveryDate}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, deliveryDate: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime" className="text-[#573e1c] flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Giờ giao hàng
                    </Label>
                    <Select value={deliveryInfo.deliveryTime} onValueChange={(value) => setDeliveryInfo({...deliveryInfo, deliveryTime: value})}>
                      <SelectTrigger className="border-[#8b6a42]">
                        <SelectValue placeholder="Chọn giờ giao hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Sáng (8:00 - 12:00)</SelectItem>
                        <SelectItem value="afternoon">Chiều (13:00 - 17:00)</SelectItem>
                        <SelectItem value="evening">Tối (18:00 - 21:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#573e1c] flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Ghi chú
                  </Label>
                  <Textarea
                    id="notes"
                    value={deliveryInfo.notes}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, notes: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t('checkout.paymentInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-[#8b6a42]">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">Thẻ tín dụng/ghi nợ</div>
                      <div className="text-sm text-[#8b6a42]">Visa, Mastercard, JCB</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="banking" id="banking" />
                    <Label htmlFor="banking" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-[#8b6a42]">Chuyển khoản qua Internet Banking</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">Ví MoMo</div>
                      <div className="text-sm text-[#8b6a42]">Thanh toán qua ví điện tử MoMo</div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Bank Transfer Information */}
                {paymentMethod === 'banking' && (
                  <div className="space-y-4 mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Thông tin chuyển khoản</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">Ngân hàng:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900 font-medium">{bankInfo.bankName}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">Số tài khoản:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900 font-mono text-lg font-bold">{bankInfo.accountNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(bankInfo.accountNumber, 'accountNumber')}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            {copiedField === 'accountNumber' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">Tên tài khoản:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900 font-medium">{bankInfo.accountName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(bankInfo.accountName, 'accountName')}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            {copiedField === 'accountName' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">Chi nhánh:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900">{bankInfo.branch}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">Số tiền cần chuyển:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900 font-bold text-lg">{formatPrice(total)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(total.toString(), 'amount')}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            {copiedField === 'amount' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500">
                      <p className="text-blue-800 text-sm">
                        <strong>Lưu ý:</strong> Vui lòng ghi rõ họ tên và số điện thoại trong nội dung chuyển khoản để chúng tôi có thể xác nhận đơn hàng nhanh chóng.
                      </p>
                    </div>
                  </div>
                )}

                {/* MoMo Information */}
                {paymentMethod === 'momo' && (
                  <div className="space-y-4 mt-4 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Smartphone className="w-5 h-5 text-pink-600" />
                      <h3 className="font-semibold text-pink-800">Thông tin ví MoMo</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-pink-700 font-medium">Số điện thoại MoMo:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-pink-900 font-mono text-lg font-bold">{momoInfo.phoneNumber}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(momoInfo.phoneNumber, 'momoPhone')}
                            className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
                          >
                            {copiedField === 'momoPhone' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-pink-700 font-medium">Tên tài khoản:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-pink-900 font-medium">{momoInfo.accountName}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(momoInfo.accountName, 'momoName')}
                            className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
                          >
                            {copiedField === 'momoName' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-pink-700 font-medium">Số tiền cần chuyển:</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-pink-900 font-bold text-lg">{formatPrice(total)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(total.toString(), 'momoAmount')}
                            className="text-pink-600 hover:text-pink-800 hover:bg-pink-100"
                          >
                            {copiedField === 'momoAmount' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-pink-100 rounded border-l-4 border-pink-500">
                      <p className="text-pink-800 text-sm">
                        <strong>Hướng dẫn:</strong> Mở ứng dụng MoMo → Chọn "Chuyển tiền" → Nhập số điện thoại trên → Nhập số tiền và ghi rõ họ tên trong tin nhắn.
                      </p>
                    </div>
                  </div>
                )}

                {/* Credit Card Information */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4 p-4 bg-[#f8f5f0] rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="cardNumber" className="text-[#573e1c]">Số thẻ *</Label>
                        <Input
                          id="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-[#573e1c]">Ngày hết hạn *</Label>
                        <Input
                          id="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo({...cardInfo, expiryDate: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-[#573e1c]">CVV *</Label>
                        <Input
                          id="cvv"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder="123"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="cardName" className="text-[#573e1c]">Tên trên thẻ *</Label>
                        <Input
                          id="cardName"
                          value={cardInfo.cardName}
                          onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#d4c5a0] sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('checkout.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const itemPrice = item.selectedVariant?.price || item.product.price;
                    const productName = language === 'vi' ? item.product.name : item.product.nameEn;
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.product.images[0]}
                          alt={productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#573e1c] truncate">
                            {productName}
                          </p>
                          <p className="text-xs text-[#8b6a42]">
                            {formatPrice(itemPrice)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-[#573e1c]">
                          {formatPrice(itemPrice * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.subtotal')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.tax')} (10%)</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
                    <span className="font-semibold text-[#573e1c]">
                      {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#573e1c]">{t('cart.total')}</span>
                  <span className="text-[#573e1c]">{formatPrice(total)}</span>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={setAgreeTerms}
                  />
                  <Label htmlFor="terms" className="text-sm text-[#8b6a42] leading-relaxed">
                    Tôi đồng ý với{' '}
                    <Link href="/terms" className="text-[#573e1c] underline">
                      điều khoản và điều kiện
                    </Link>{' '}
                    của cửa hàng
                  </Label>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!agreeTerms}
                  className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300"
                >
                  {t('checkout.placeOrder')}
                </Button>

                <div className="text-center text-xs text-[#8b6a42]">
                  Thông tin của bạn được bảo mật và an toàn
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}