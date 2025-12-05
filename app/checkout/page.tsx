'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, MapPin, FileText, Copy, CheckCircle, Building, Smartphone, Gift, Star, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCheckout } from '@/hooks/use-checkout';
import { PaymentMethod } from '@/types';
import { formatCurrencyVND } from '@/lib/utils.currency';
import { LoadingOverlay } from '@/components/common/LoadOverlay';

export default function CheckoutPage() {
  const {
    loading,
    orderData,
    deliveryInfo,
    agreeTerms,
    copiedField,
    voucherCode,
    voucherError,
    appliedVoucher,
    pointsToRedeem,
    discountCalculation,
    loyaltyPoints,
    total,
    subtotal,
    shipping,
    tax,
    copyToClipboard,
    handleRemoveVoucher,
    handleApplyVoucher,
    handlePlaceOrder,
    handlePointsChange,
    setVoucherCode,
    setAgreeTerms,
    setDeliveryInfo,
    setOrderData,
    onSetPaymentMethod
  } = useCheckout()
  const { t } = useLanguage();
  const { items } = useCart()


  // Bank and MoMo account information
  const bankInfo = {
    bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
    accountNumber: '0123456789',
    accountName: 'CONG TY TNHH AN PHAT FOOD',
    branch: 'Chi nhánh Sài Gòn'
  };

  const momoInfo = {
    phoneNumber: '0901234567',
    accountName: 'An Phat Food'
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
    <form onSubmit={handlePlaceOrder}>
      <LoadingOverlay loading={loading} />

      <div className="min-h-screen bg-[#f8f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                type='button'
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
                      <Label htmlFor="name" className="text-[#573e1c]">
                        {t('checkout.form.fullName')} *
                      </Label>
                      <Input
                        id="name"
                        value={orderData.receiverInfo?.name}
                        placeholder={t("checkout.form.customerName")}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            receiverInfo: {
                              ...orderData.receiverInfo,
                              name: e.target.value,
                            },
                          })
                        }
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#573e1c]">
                        {t('checkout.form.phone')} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t("checkout.form.customerPhone")}
                        value={orderData.receiverInfo?.phone || ""}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            receiverInfo: {
                              ...orderData.receiverInfo,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
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
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      placeholder={t('checkout.form.addressPlaceholder')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward" className="text-[#573e1c]">{t('checkout.form.ward')} *</Label>
                      <Input
                        id="ward"
                        value={deliveryInfo.ward}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, ward: e.target.value })}
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#573e1c]">{t('checkout.form.city')} *</Label>
                      <Input
                        id="city"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                        className="border-[#8b6a42] focus:border-[#573e1c]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-[#573e1c] flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {t('checkout.form.note')}
                    </Label>
                    <Textarea
                      id="notes"
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
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
                  <RadioGroup value={orderData.paymentMethod} onValueChange={onSetPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                      <RadioGroupItem value={PaymentMethod.cash} id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-[#573e1c]">{t('checkout.payment.cod')}</div>
                        <div className="text-sm text-[#8b6a42]">{t('checkout.payment.codDesc')}</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                      <RadioGroupItem value={PaymentMethod.bankTransfer} id="banking" />
                      <Label htmlFor="banking" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-[#573e1c]">{t('checkout.payment.banking')}</div>
                        <div className="text-sm text-[#8b6a42]">{t('checkout.payment.bankingDesc')}</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border border-[#d4c5a0] rounded-lg">
                      <RadioGroupItem value={PaymentMethod.momo} id="momo" />
                      <Label htmlFor="momo" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-[#573e1c]">{t('checkout.payment.momo')}</div>
                        <div className="text-sm text-[#8b6a42]">{t('checkout.payment.momoDesc')}</div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Bank Transfer Information */}
                  {orderData.paymentMethod === PaymentMethod.bankTransfer && (
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
                              type='button'
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
                              type='button'
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
                            <span className="text-blue-900 font-bold text-lg">{formatCurrencyVND(total)}</span>
                            <Button
                              type='button'
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
                  {orderData.paymentMethod === PaymentMethod.momo && (
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
                              type='button'
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
                              type='button'
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
                            <span className="text-pink-900 font-bold text-lg">{formatCurrencyVND(total)}</span>
                            <Button
                              type='button'
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
                      const itemPrice = item.product?.price || 0

                      return (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#573e1c] truncate">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-[#8b6a42]">
                              {formatCurrencyVND(itemPrice)} x {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-[#573e1c]">
                            {formatCurrencyVND(itemPrice * item.quantity!)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  {/* Voucher Section */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#573e1c] flex items-center">
                      <Gift className="w-4 h-4 mr-2" />
                      {t('checkout.voucher.title')}
                    </h4>

                    {!appliedVoucher ? (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            placeholder={t('checkout.voucher.placeholder')}
                            className="border-[#8b6a42] focus:border-[#573e1c]"
                          />
                          <Button
                            type='button'
                            onClick={handleApplyVoucher}
                            variant="outline"
                            className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                          >
                            {t('checkout.voucher.apply')}
                          </Button>
                        </div>
                        {voucherError && (
                          <p className="text-sm text-red-600">{voucherError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-800">{appliedVoucher}</p>
                            <p className="text-sm text-green-600">
                              -{formatCurrencyVND(discountCalculation.voucherDiscount)}
                            </p>
                          </div>
                          <Button
                            type='button'
                            onClick={handleRemoveVoucher}
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Loyalty Points Section */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#573e1c] flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      {t('checkout.points.title')}
                    </h4>

                    <div className="text-sm text-[#8b6a42]">
                      {t('checkout.points.available')}: {loyaltyPoints.toLocaleString()} {t('checkout.points.unit')}
                    </div>

                    {loyaltyPoints > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            type='button'
                            variant="outline"
                            size="sm"
                            onClick={() => handlePointsChange(-100)}
                            disabled={pointsToRedeem <= 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <div className="flex-1 text-center">
                            <span className="font-medium">{pointsToRedeem.toLocaleString()}</span>
                          </div>
                          <Button
                            type='button'
                            variant="outline"
                            size="sm"
                            onClick={() => handlePointsChange(100)}
                            disabled={pointsToRedeem >= loyaltyPoints}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {pointsToRedeem > 0 && (
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                            {t('checkout.points.discount')}: -{formatCurrencyVND(discountCalculation.pointsDiscount)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#8b6a42]">{t('cart.subtotal')}</span>
                      <span className="font-semibold text-[#573e1c]">
                        {formatCurrencyVND(subtotal)}
                      </span>
                    </div>

                    {discountCalculation.voucherDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-green-600">{t('checkout.voucher.discount')}</span>
                        <span className="font-semibold text-green-600">
                          -{formatCurrencyVND(discountCalculation.voucherDiscount)}
                        </span>
                      </div>
                    )}

                    {discountCalculation.pointsDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-blue-600">{t('checkout.points.discount')}</span>
                        <span className="font-semibold text-blue-600">
                          -{formatCurrencyVND(discountCalculation.pointsDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-[#8b6a42]">{t('cart.tax')} (10%)</span>
                      <span className="font-semibold text-[#573e1c]">
                        {formatCurrencyVND(tax)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8b6a42]">{t('cart.shipping')}</span>
                      <span className="font-semibold text-[#573e1c]">
                        {shipping === 0 ? 'Miễn phí' : formatCurrencyVND(shipping)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#573e1c]">{t('cart.total')}</span>
                    <span className="text-[#573e1c]">{formatCurrencyVND(total)}</span>
                  </div>

                  {/* Points to Earn */}
                  <div className="p-3 bg-[#efe1c1] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-[#573e1c]" />
                      <span className="text-sm text-[#573e1c]">
                        {t('checkout.points.earn')}: +{Math.floor(subtotal * 0.05).toLocaleString()} {t('checkout.points.unit')}
                      </span>
                    </div>
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
                    type="submit"
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
    </form>
  );
}