'use client';

import React from 'react';
import { User, Package, MapPin, Settings, LogOut, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useAccount } from '@/hooks/use-account';
import { formatCurrency } from '@/lib/utils.currency';
import { getOrderStatusColor } from '@/lib/utils.style';
import { formatDate } from '@/lib/utils.date';
import Image from 'next/image';
import { FormattedNumber } from '@/components/ui/formatted-number';
import { FormattedCurrency } from '@/components/ui/formatted-currency';

export default function AccountPage() {
  const {
    user,
    userStats,
    recentOrders,
    t,
  } = useAccount()

  if (!user) {
    return null;
  }

  const getStatusText = (status: string) => {
    return t(`account.status.${status}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {t('account.personalInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {user.avatar ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#573e1c]">
                      <Image
                        width={20}
                        height={20}
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-[#573e1c] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#efe1c1] text-2xl font-bold">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-[#573e1c] text-lg">{user.fullName}</h3>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('account.phoneNumber')}:</span>
                    <span className="font-semibold text-[#573e1c]">{user.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('account.email')}:</span>
                    <span className="font-semibold text-[#573e1c]">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">{t('account.memberSince')}:</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatDate(user.createdAt!)}
                    </span>
                  </div>
                  {user.customer?.company && (
                    <div className="flex justify-between">
                      <span className="text-[#8b6a42]">{t('account.company')}:</span>
                      <span className="font-semibold text-[#573e1c]">{user.customer.company}</span>
                    </div>
                  )}
                  {user.customer?.location && (
                    <div className="flex justify-between">
                      <span className="text-[#8b6a42]">{t('account.location')}:</span>
                      <span className="font-semibold text-[#573e1c]">{user.customer.location}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/profile">
                      <Edit className="w-4 h-4 mr-2" />
                      {t('account.editProfile')}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/addresses">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t('account.manageAddresses')}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      {t('account.accountSettings')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-white border-[#d4c5a0]">
                <CardContent className="p-6 text-center">
                  <FormattedNumber
                    as='div'
                    value={userStats.totalAddresses}
                    className="text-2xl font-bold text-[#573e1c] mb-1"
                  />
                  <div className="text-sm text-[#8b6a42]">{t('account.savedAddresses')}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d4c5a0]">
                <CardContent className="p-6 text-center">
                  <FormattedNumber
                    as='div'
                    value={userStats.totalOrders}
                    className="text-2xl font-bold text-[#573e1c] mb-1"
                  />
                  <div className="text-sm text-[#8b6a42]">{t('account.totalOrders')}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d4c5a0]">
                <CardContent className="p-6 text-center">
                  <FormattedCurrency
                    as='div'
                    value={userStats.totalSpent}
                    className="text-2xl font-bold text-[#573e1c] mb-1"
                  />
                  <div className="text-sm text-[#8b6a42]">{t('account.totalSpent')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#573e1c] flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    {t('account.recentOrders')}
                  </CardTitle>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/orders">
                      {t('account.viewAll')}
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-[#d4c5a0] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[#573e1c]">#{order.number}</h4>
                          <p className="text-sm text-[#8b6a42]">
                            {new Date(order.date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[#8b6a42]">
                          {order.items} {t('account.items')} • {formatCurrency(order.total)}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                          >
                            <Link href={`/account/orders/${order.id}`}>
                              <Eye className="w-3 h-3 mr-1" />
                              {t('account.orderDetails')}
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button
                              size="sm"
                              className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                            >
                              {t('account.reorder')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('account.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12"
                  >
                    <Link href="/products">
                      <Package className="w-4 h-4 mr-2" />
                      {t('account.continueShopping')}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-12"
                  >
                    <Link href="/account/orders">
                      <Eye className="w-4 h-4 mr-2" />
                      {t('account.trackOrders')}
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