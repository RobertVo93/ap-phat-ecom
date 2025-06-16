'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, Settings, LogOut, Edit, Eye } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function AccountPage() {
  const { language, t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Mock recent orders data
  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 125000,
      status: 'delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 85000,
      status: 'shipping',
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      total: 65000,
      status: 'confirmed',
      items: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Đã giao';
      case 'shipping': return 'Đang giao';
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xử lý';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
                {t('account.dashboard')}
              </h1>
              <p className="text-[#8b6a42] mt-2">
                Chào mừng trở lại, {user.name}!
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('nav.logout')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {user.avatar ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#573e1c]">
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-[#573e1c] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-[#efe1c1] text-2xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-[#573e1c] text-lg">{user.name}</h3>
                  <p className="text-[#8b6a42] text-sm">{user.email}</p>
                  <p className="text-[#8b6a42] text-sm">{user.phone}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Tổng đơn hàng:</span>
                    <span className="font-semibold text-[#573e1c]">{user.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Tổng chi tiêu:</span>
                    <span className="font-semibold text-[#573e1c]">
                      {formatPrice(user.totalSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8b6a42]">Thành viên từ:</span>
                    <span className="font-semibold text-[#573e1c]">
                      {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
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
                      Chỉnh sửa hồ sơ
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/addresses">
                      <MapPin className="w-4 h-4 mr-2" />
                      Quản lý địa chỉ
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt tài khoản
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
                  <div className="text-2xl font-bold text-[#573e1c] mb-1">
                    {user.totalOrders}
                  </div>
                  <div className="text-sm text-[#8b6a42]">Tổng đơn hàng</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d4c5a0]">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-[#573e1c] mb-1">
                    {formatPrice(user.totalSpent)}
                  </div>
                  <div className="text-sm text-[#8b6a42]">Tổng chi tiêu</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d4c5a0]">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-[#573e1c] mb-1">
                    {user.addresses.length}
                  </div>
                  <div className="text-sm text-[#8b6a42]">Địa chỉ đã lưu</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="bg-white border-[#d4c5a0]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#573e1c] flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Đơn hàng gần đây
                  </CardTitle>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
                  >
                    <Link href="/account/orders">
                      Xem tất cả
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
                          <h4 className="font-semibold text-[#573e1c]">#{order.id}</h4>
                          <p className="text-sm text-[#8b6a42]">
                            {new Date(order.date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[#8b6a42]">
                          {order.items} sản phẩm • {formatPrice(order.total)}
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
                              Chi tiết
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button
                              size="sm"
                              className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                            >
                              Mua lại
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
                <CardTitle className="text-[#573e1c]">Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12"
                  >
                    <Link href="/products">
                      <Package className="w-4 h-4 mr-2" />
                      Tiếp tục mua sắm
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] h-12"
                  >
                    <Link href="/account/orders">
                      <Eye className="w-4 h-4 mr-2" />
                      Theo dõi đơn hàng
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