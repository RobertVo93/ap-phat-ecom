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
      alert(t('checkout.termsAlert'));
      return;
    }
    
    // Here you would typically send the order to your backend
    alert(t('checkout.successAlert'));
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
            {t('checkout.empty.title')}
          </h2>
          <p className="text-[#8b6a42] mb-8">
            {t('checkout.empty.message')}
          </p>
          <Button
            asChild
            className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
          >
            <Link href="/products">
              {t('cart.continue.shopping')}
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
                {t('checkout.backToCart')}
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
                    <Label htmlFor="name" className="text-[#573e1c]">{t('checkout.form.fullName')} *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#573e1c]">{t('checkout.form.phone')} *</Label>
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
                  <Label htmlFor="email" className="text-[#573e1c]">{t('checkout.form.email')} *</Label>
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
                  <Label htmlFor="address" className="text-[#573e1c]">{t('checkout.form.address')} *</Label>
                  <Input
                    id="address"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder={t('checkout.form.addressPlaceholder')}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ward" className="text-[#573e1c]">{t('checkout.form.ward')} *</Label>
                    <Input
                      id="ward"
                      value={deliveryInfo.ward}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, ward: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-[#573e1c]">{t('checkout.form.district')} *</Label>
                    <Input
                      id="district"
                      value={deliveryInfo.district}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, district: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[#573e1c]">{t('checkout.form.city')} *</Label>
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
                      {t('checkout.form.deliveryDate')}
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
                      {t('checkout.form.deliveryTime')}
                    </Label>
                    <Select value={deliveryInfo.deliveryTime} onValueChange={(value) => setDeliveryInfo({...deliveryInfo, deliveryTime: value})}>
                      <SelectTrigger className="border-[#8b6a42]">
                        <SelectValue placeholder={t('checkout.form.deliveryTimePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">{t('checkout.form.deliveryTimeOptions.morning')}</SelectItem>
                        <SelectItem value="afternoon">{t('checkout.form.deliveryTimeOptions.afternoon')}</SelectItem>
                        <SelectItem value="evening">{t('checkout.form.deliveryTimeOptions.evening')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#573e1c] flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {t('checkout.form.note')}
                  </Label>
                  <Textarea
                    id="notes"
                    value={deliveryInfo.notes}
                    onChange={(e) => setDeliveryInfo({...deliveryInfo, notes: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder={t('checkout.form.notePlaceholder')}
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
                      <div className="font-semibold text-[#573e1c]">{t('checkout.payment.cod')}</div>
                      <div className="text-sm text-[#8b6a42]">{t('checkout.payment.codDesc')}</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">{t('checkout.payment.card')}</div>
                      <div className="text-sm text-[#8b6a42]">{t('checkout.payment.cardDesc')}</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="banking" id="banking" />
                    <Label htmlFor="banking" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">{t('checkout.payment.banking')}</div>
                      <div className="text-sm text-[#8b6a42]">{t('checkout.payment.bankingDesc')}</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex-1 cursor-pointer">
                      <div className="font-semibold text-[#573e1c]">{t('checkout.payment.momo')}</div>
                      <div className="text-sm text-[#8b6a42]">{t('checkout.payment.momoDesc')}</div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Bank Transfer Information */}
                {paymentMethod === 'banking' && (
                  <div className="space-y-4 mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">{t('checkout.payment.bankInfo')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">{t('checkout.payment.bankName')}</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900 font-medium">{bankInfo.bankName}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">{t('checkout.payment.accountNumber')}</Label>
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
                        <Label className="text-blue-700 font-medium">{t('checkout.payment.accountName')}</Label>
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
                        <Label className="text-blue-700 font-medium">{t('checkout.payment.branch')}</Label>
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <span className="text-blue-900">{bankInfo.branch}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">{t('checkout.payment.amount')}</Label>
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
                        <strong>{t('checkout.payment.bankNote')}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* MoMo Information */}
                {paymentMethod === 'momo' && (
                  <div className="space-y-4 mt-4 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Smartphone className="w-5 h-5 text-pink-600" />
                      <h3 className="font-semibold text-pink-800">{t('checkout.payment.momoInfo')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-pink-700 font-medium">{t('checkout.payment.momoPhone')}</Label>
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
                        <Label className="text-pink-700 font-medium">{t('checkout.payment.momoName')}</Label>
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
                        <Label className="text-pink-700 font-medium">{t('checkout.payment.momoAmount')}</Label>
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
                        <strong>{t('checkout.payment.momoGuide')}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Credit Card Information */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4 p-4 bg-[#f8f5f0] rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="cardNumber" className="text-[#573e1c]">{t('checkout.payment.cardNumber')}</Label>
                        <Input
                          id="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder={t('checkout.payment.cardNumberPlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-[#573e1c]">{t('checkout.payment.expiryDate')}</Label>
                        <Input
                          id="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo({...cardInfo, expiryDate: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder={t('checkout.payment.expiryDatePlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-[#573e1c]">{t('checkout.payment.cvv')}</Label>
                        <Input
                          id="cvv"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder={t('checkout.payment.cvvPlaceholder')}
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="cardName" className="text-[#573e1c]">{t('checkout.payment.cardName')}</Label>
                        <Input
                          id="cardName"
                          value={cardInfo.cardName}
                          onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                          className="border-[#8b6a42] focus:border-[#573e1c]"
                          placeholder={t('checkout.payment.cardNamePlaceholder')}
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
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm text-[#8b6a42] leading-relaxed">
                    {t('checkout.terms')}{' '}
                    <Link href="/terms" className="text-[#573e1c] underline">
                      {t('checkout.terms.link')}
                    </Link>{' '}
                    {t('checkout.terms.suffix')}
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
                  {t('checkout.security')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}