'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Eye, RotateCcw, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrdersPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!user) {
    return null;
  }

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 125000,
      status: 'delivered',
      items: [
        { name: 'Bánh Tráng Nướng Tây Ninh', quantity: 2, price: 25000 },
        { name: 'Bánh Phở Hà Nội', quantity: 3, price: 15000 },
        { name: 'Bún Tươi Miền Nam', quantity: 2, price: 12000 }
      ],
      deliveryAddress: 'Quận 1, TP.HCM',
      trackingNumber: 'VN123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 85000,
      status: 'shipping',
      items: [
        { name: 'Bánh Tráng Cuốn Thịt Nướng', quantity: 2, price: 20000 },
        { name: 'Bánh Phở Hà Nội', quantity: 3, price: 15000 }
      ],
      deliveryAddress: 'Quận 3, TP.HCM',
      trackingNumber: 'VN987654321'
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      total: 65000,
      status: 'confirmed',
      items: [
        { name: 'Bún Tươi Miền Nam', quantity: 3, price: 12000 },
        { name: 'Bánh Tráng Nướng Tây Ninh', quantity: 1, price: 25000 }
      ],
      deliveryAddress: 'Quận 7, TP.HCM',
      trackingNumber: 'VN456789123'
    },
    {
      id: 'ORD-004',
      date: '2023-12-28',
      total: 95000,
      status: 'cancelled',
      items: [
        { name: 'Bánh Phở Hà Nội', quantity: 4, price: 15000 },
        { name: 'Bánh Tráng Cuốn Thịt Nướng', quantity: 1, price: 20000 }
      ],
      deliveryAddress: 'Quận 2, TP.HCM',
      trackingNumber: null
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                Quay lại tài khoản
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('account.orders')}
          </h1>
          <p className="text-[#8b6a42] mt-2">
            Theo dõi và quản lý đơn hàng của bạn
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white border-[#d4c5a0] mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6a42] w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#8b6a42] focus:border-[#573e1c]"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#8b6a42]" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-[#8b6a42]">
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="shipping">Đang giao</SelectItem>
                    <SelectItem value="delivered">Đã giao</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="bg-white border-[#d4c5a0]">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-[#8b6a42] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#573e1c] mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-[#8b6a42] mb-6">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
                <Button
                  asChild
                  className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
                >
                  <Link href="/products">
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white border-[#d4c5a0]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[#573e1c] flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Đơn hàng #{order.id}
                      </CardTitle>
                      <p className="text-[#8b6a42] text-sm mt-1">
                        Đặt ngày {new Date(order.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-[#efe1c1] last:border-b-0">
                        <div className="flex-1">
                          <span className="font-medium text-[#573e1c]">{item.name}</span>
                          <span className="text-[#8b6a42] ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold text-[#573e1c]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#efe1c1]">
                    <div className="text-[#8b6a42]">
                      <p>Giao đến: {order.deliveryAddress}</p>
                      {order.trackingNumber && (
                        <p className="text-sm">Mã vận đơn: {order.trackingNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#573e1c]">
                        Tổng: {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
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
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Mua lại
                      </Button>
                    )}
                    
                    {order.status === 'shipping' && order.trackingNumber && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                      >
                        Theo dõi
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}