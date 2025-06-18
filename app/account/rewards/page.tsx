'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gift, Star, Clock, TrendingUp, TrendingDown, Calendar, Award, Copy, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { useRewards } from '@/lib/contexts/rewards-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function RewardsPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { loyaltyPoints, vouchers, pointTransactions } = useRewards();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVoucherStatus = (voucher: any) => {
    if (voucher.isUsed) return { text: t('rewards.voucher.used'), color: 'bg-gray-100 text-gray-600' };
    if (new Date(voucher.expiryDate) < new Date()) return { text: t('rewards.voucher.expired'), color: 'bg-red-100 text-red-600' };
    return { text: t('rewards.voucher.available'), color: 'bg-green-100 text-green-600' };
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      // Optionally handle error
    }
  };

  const availableVouchers = vouchers.filter(v => !v.isUsed && new Date(v.expiryDate) > new Date());
  const usedVouchers = vouchers.filter(v => v.isUsed || new Date(v.expiryDate) <= new Date());

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
              <Link href="/account">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('account.backToAccount')}
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('rewards.title')}
          </h1>
          <p className="text-[#8b6a42] mt-2">
            {t('rewards.subtitle')}
          </p>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-[#573e1c] to-[#8b6a42] border-none text-white">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <div className="text-3xl font-bold mb-2">{loyaltyPoints.toLocaleString()}</div>
              <div className="text-sm opacity-90">{t('rewards.currentPoints')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#d4c5a0]">
            <CardContent className="p-6 text-center">
              <Gift className="w-12 h-12 mx-auto mb-4 text-[#573e1c]" />
              <div className="text-3xl font-bold text-[#573e1c] mb-2">{availableVouchers.length}</div>
              <div className="text-sm text-[#8b6a42]">{t('rewards.availableVouchers')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#d4c5a0]">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-[#573e1c]" />
              <div className="text-3xl font-bold text-[#573e1c] mb-2">
                {formatPrice(loyaltyPoints)}
              </div>
              <div className="text-sm text-[#8b6a42]">{t('rewards.pointsValue')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="vouchers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#efe1c1]">
            <TabsTrigger value="vouchers" className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1]">
              {t('rewards.tabs.vouchers')}
            </TabsTrigger>
            <TabsTrigger value="points" className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1]">
              {t('rewards.tabs.points')}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#573e1c] data-[state=active]:text-[#efe1c1]">
              {t('rewards.tabs.history')}
            </TabsTrigger>
          </TabsList>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="mt-6">
            <div className="space-y-6">
              {/* Available Vouchers */}
              <div>
                <h3 className="text-xl font-semibold text-[#573e1c] mb-4">
                  {t('rewards.availableVouchers')} ({availableVouchers.length})
                </h3>
                {availableVouchers.length === 0 ? (
                  <Card className="bg-white border-[#d4c5a0]">
                    <CardContent className="p-8 text-center">
                      <Gift className="w-16 h-16 text-[#8b6a42] mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-[#573e1c] mb-2">
                        {t('rewards.noVouchers')}
                      </h4>
                      <p className="text-[#8b6a42]">
                        {t('rewards.noVouchersDesc')}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableVouchers.map((voucher) => {
                      const status = getVoucherStatus(voucher);
                      return (
                        <Card key={voucher.id} className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-[#573e1c] text-lg mb-1">
                                  {language === 'vi' ? voucher.title : voucher.titleEn}
                                </h4>
                                <p className="text-[#8b6a42] text-sm">
                                  {language === 'vi' ? voucher.description : voucher.descriptionEn}
                                </p>
                              </div>
                              <Badge className={status.color}>
                                {status.text}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-[#8b6a42]">{t('rewards.voucher.code')}:</span>
                                <span className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-[#573e1c]">{voucher.code}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(voucher.code)}
                                    className="p-1 rounded hover:bg-[#efe1c1] focus:outline-none"
                                    title={copiedCode === voucher.code ? t('common.copied') : t('common.copy')}
                                  >
                                    {copiedCode === voucher.code ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-[#8b6a42]" />
                                    )}
                                  </button>
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#8b6a42]">{t('rewards.voucher.discount')}:</span>
                                <span className="font-semibold text-[#573e1c]">
                                  {voucher.discountType === 'percentage' 
                                    ? `${voucher.discountValue}%` 
                                    : formatPrice(voucher.discountValue)
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#8b6a42]">{t('rewards.voucher.minOrder')}:</span>
                                <span className="text-[#573e1c]">{formatPrice(voucher.minOrderAmount)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#8b6a42]">{t('rewards.voucher.expiry')}:</span>
                                <span className="text-[#573e1c]">{formatDate(voucher.expiryDate)}</span>
                              </div>
                            </div>

                            <Button
                              asChild
                              className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                            >
                              <Link href="/products">
                                {t('rewards.voucher.useNow')}
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Used/Expired Vouchers */}
              {usedVouchers.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#573e1c] mb-4">
                    {t('rewards.usedVouchers')} ({usedVouchers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usedVouchers.map((voucher) => {
                      const status = getVoucherStatus(voucher);
                      return (
                        <Card key={voucher.id} className="bg-gray-50 border-gray-200 opacity-75">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-600 text-lg mb-1">
                                  {language === 'vi' ? voucher.title : voucher.titleEn}
                                </h4>
                                <p className="text-gray-500 text-sm">
                                  {language === 'vi' ? voucher.description : voucher.descriptionEn}
                                </p>
                              </div>
                              <Badge className={status.color}>
                                {status.text}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-gray-500">{t('rewards.voucher.code')}:</span>
                                <span className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-gray-600">{voucher.code}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(voucher.code)}
                                    className="p-1 rounded hover:bg-gray-200 focus:outline-none"
                                    title={copiedCode === voucher.code ? t('common.copied') : t('common.copy')}
                                  >
                                    {copiedCode === voucher.code ? (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{t('rewards.voucher.expiry')}:</span>
                                <span className="text-gray-600">{formatDate(voucher.expiryDate)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Points Tab */}
          <TabsContent value="points" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white border-[#d4c5a0]">
                <CardHeader>
                  <CardTitle className="text-[#573e1c]">{t('rewards.pointsInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#573e1c]">{t('rewards.howToEarn')}</h4>
                      <ul className="space-y-2 text-sm text-[#8b6a42]">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{t('rewards.earnRule1')}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{t('rewards.earnRule2')}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{t('rewards.earnRule3')}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#573e1c]">{t('rewards.howToUse')}</h4>
                      <ul className="space-y-2 text-sm text-[#8b6a42]">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{t('rewards.useRule1')}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{t('rewards.useRule2')}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#573e1c] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{t('rewards.useRule3')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <Button
                      asChild
                      className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                    >
                      <Link href="/products">
                        {t('rewards.startShopping')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('rewards.transactionHistory')}</CardTitle>
              </CardHeader>
              <CardContent>
                {pointTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-[#8b6a42] mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-[#573e1c] mb-2">
                      {t('rewards.noTransactions')}
                    </h4>
                    <p className="text-[#8b6a42]">
                      {t('rewards.noTransactionsDesc')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pointTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-[#efe1c1] rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'earned' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'earned' ? (
                              <TrendingUp className="w-5 h-5" />
                            ) : (
                              <TrendingDown className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#573e1c]">
                              {language === 'vi' ? transaction.description : transaction.descriptionEn}
                            </h4>
                            <p className="text-sm text-[#8b6a42] flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-lg ${
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}{transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-[#8b6a42]">
                            {t('rewards.points')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}