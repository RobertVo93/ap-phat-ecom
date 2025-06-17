'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useCart } from '@/lib/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
  const { language, t } = useLanguage();
  const { items, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1; // 10% VAT
  const shipping = subtotal > 100000 ? 0 : 25000; // Free shipping over 100k VND
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f5f0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-[#8b6a42] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
              {t('cart.empty')}
            </h2>
            <p className="text-[#8b6a42] mb-8">
              {t('cart.empty.message')}
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
              <Link href="/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('cart.continue.shopping')}
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('cart.title')} ({getCartItemsCount()} {t('cart.items.count')})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.selectedVariant?.price || item.product.price;
              const productName = language === 'vi' ? item.product.name : item.product.nameEn;
              const variantName = item.selectedVariant 
                ? (language === 'vi' ? item.selectedVariant.name : item.selectedVariant.nameEn)
                : null;

              return (
                <Card key={item.id} className="bg-white border-[#d4c5a0]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-[#573e1c] text-lg">
                              {productName}
                            </h3>
                            {variantName && (
                              <Badge variant="secondary" className="bg-[#efe1c1] text-[#573e1c]">
                                {variantName}
                              </Badge>
                            )}
                            <p className="text-sm text-[#8b6a42]">
                              {language === 'vi' ? item.product.category : item.product.categoryEn}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-[#8b6a42] rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-[#573e1c] hover:bg-[#efe1c1]"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-[#573e1c] hover:bg-[#efe1c1]"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-[#573e1c] text-lg">
                              {formatPrice(itemPrice * item.quantity)}
                            </div>
                            <div className="text-sm text-[#8b6a42]">
                              {formatPrice(itemPrice)} x {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#d4c5a0] sticky top-8">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('cart.order.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      {shipping === 0 ? t('cart.shipping.free') : formatPrice(shipping)}
                    </span>
                  </div>
                  
                  {shipping === 0 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      {t('cart.shipping.free.message')}
                    </div>
                  )}
                  
                  {subtotal < 100000 && (
                    <div className="text-sm text-[#8b6a42] bg-[#efe1c1] p-2 rounded">
                      {t('cart.shipping.free.threshold').replace('{amount}', formatPrice(100000 - subtotal))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-[#573e1c]">{t('cart.total')}</span>
                  <span className="text-[#573e1c]">{formatPrice(total)}</span>
                </div>

                <Button
                  asChild
                  className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold"
                >
                  <Link href="/checkout">
                    {t('cart.checkout')}
                  </Link>
                </Button>

                <div className="text-center">
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/products">
                      {t('cart.continue.shopping')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}