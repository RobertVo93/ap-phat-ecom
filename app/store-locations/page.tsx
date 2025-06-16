'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Car, Bus, Train } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { mockStoreLocations } from '@/lib/mock-data/store-locations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StoreLocationsPage() {
  const { language, t } = useLanguage();
  const [selectedStore, setSelectedStore] = useState(mockStoreLocations[0]);

  const storeFeatures = [
    {
      icon: Car,
      title: 'Bãi đậu xe',
      description: 'Chỗ đậu xe máy và ô tô miễn phí'
    },
    {
      icon: Bus,
      title: 'Giao thông công cộng',
      description: 'Gần các tuyến xe buýt chính'
    },
    {
      icon: Train,
      title: 'Tàu điện ngầm',
      description: 'Cách ga tàu điện 200m'
    }
  ];

  const storeServices = [
    'Tư vấn sản phẩm miễn phí',
    'Dịch vụ giao hàng tận nơi',
    'Bán sỉ với giá ưu đãi',
    'Đổi trả trong 7 ngày',
    'Thanh toán đa dạng',
    'Đóng gói quà tặng'
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#573e1c] to-[#8b6a42] py-16 lg:py-24">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#efe1c1] mb-6">
            {t('store.locations')}
          </h1>
          <p className="text-xl text-[#d4c5a0] max-w-3xl mx-auto leading-relaxed">
            Tìm cửa hàng Rice & Noodles gần bạn nhất. Chúng tôi có mặt tại nhiều địa điểm để phục vụ bạn tốt nhất.
          </p>
          <div className="mt-8 flex justify-center">
            <Badge className="bg-[#efe1c1] text-[#573e1c] px-4 py-2 text-lg">
              {mockStoreLocations.length} cửa hàng trên toàn quốc
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-[#573e1c] mb-6">Danh sách cửa hàng</h2>
            {mockStoreLocations.map((store) => (
              <Card 
                key={store.id} 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedStore.id === store.id 
                    ? 'border-[#573e1c] ring-2 ring-[#573e1c] ring-opacity-50 bg-[#efe1c1]' 
                    : 'border-[#d4c5a0] hover:border-[#8b6a42] bg-white'
                }`}
                onClick={() => setSelectedStore(store)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-[#573e1c] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#efe1c1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#573e1c] mb-2">
                        {language === 'vi' ? store.name : store.nameEn}
                      </h3>
                      <p className="text-sm text-[#8b6a42] mb-2">
                        {language === 'vi' ? store.address : store.addressEn}
                      </p>
                      <div className="flex items-center text-xs text-[#8b6a42]">
                        <Clock className="w-3 h-3 mr-1" />
                        {language === 'vi' ? store.hours : store.hoursEn}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Store Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Store Info */}
            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c] text-2xl flex items-center">
                  <MapPin className="w-6 h-6 mr-3" />
                  {language === 'vi' ? selectedStore.name : selectedStore.nameEn}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Map Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-[#efe1c1] to-[#d4c5a0] rounded-lg flex items-center justify-center">
                  <div className="text-center text-[#573e1c]">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-semibold text-lg">Bản đồ cửa hàng</p>
                    <p className="text-sm text-[#8b6a42]">
                      {language === 'vi' ? selectedStore.address : selectedStore.addressEn}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg">
                    <Phone className="w-5 h-5 text-[#573e1c]" />
                    <div>
                      <p className="font-semibold text-[#573e1c] text-sm">Điện thoại</p>
                      <p className="text-[#8b6a42] text-sm">{selectedStore.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg">
                    <Mail className="w-5 h-5 text-[#573e1c]" />
                    <div>
                      <p className="font-semibold text-[#573e1c] text-sm">Email</p>
                      <p className="text-[#8b6a42] text-sm">{selectedStore.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg">
                    <Clock className="w-5 h-5 text-[#573e1c]" />
                    <div>
                      <p className="font-semibold text-[#573e1c] text-sm">Giờ mở cửa</p>
                      <p className="text-[#8b6a42] text-sm">
                        {language === 'vi' ? selectedStore.hours : selectedStore.hoursEn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]">
                    <Navigation className="w-4 h-4 mr-2" />
                    Chỉ đường
                  </Button>
                  <Button variant="outline" className="flex-1 border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]">
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi điện
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Store Features */}
            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">Tiện ích cửa hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {storeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border border-[#d4c5a0] rounded-lg">
                      <feature.icon className="w-6 h-6 text-[#573e1c]" />
                      <div>
                        <h4 className="font-semibold text-[#573e1c] text-sm">{feature.title}</h4>
                        <p className="text-xs text-[#8b6a42]">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">Dịch vụ tại cửa hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {storeServices.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#573e1c] rounded-full"></div>
                      <span className="text-[#8b6a42] text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Special Offers */}
            <Card className="bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] border-[#8b6a42] shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#573e1c] mb-4">
                    Ưu đãi đặc biệt tại cửa hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-[#8b6a42]">
                      <h4 className="font-semibold text-[#573e1c] mb-2">Giảm 10%</h4>
                      <p className="text-sm text-[#8b6a42]">Cho khách hàng mua lần đầu</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#8b6a42]">
                      <h4 className="font-semibold text-[#573e1c] mb-2">Miễn phí giao hàng</h4>
                      <p className="text-sm text-[#8b6a42]">Đơn hàng từ 100.000đ</p>
                    </div>
                  </div>
                  <Button className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]">
                    Xem thêm ưu đãi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <Card className="bg-white border-[#d4c5a0] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#573e1c] text-center text-2xl">Cửa hàng sắp khai trương</CardTitle>
              <p className="text-center text-[#8b6a42]">
                Chúng tôi đang mở rộng để phục vụ bạn tốt hơn
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border border-[#d4c5a0] rounded-lg">
                  <MapPin className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
                  <h4 className="font-semibold text-[#573e1c] mb-2">Quận 7, TP.HCM</h4>
                  <p className="text-sm text-[#8b6a42] mb-3">Dự kiến: Tháng 3/2024</p>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Sắp khai trương
                  </Badge>
                </div>
                <div className="text-center p-6 border border-[#d4c5a0] rounded-lg">
                  <MapPin className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
                  <h4 className="font-semibold text-[#573e1c] mb-2">Hà Nội</h4>
                  <p className="text-sm text-[#8b6a42] mb-3">Dự kiến: Tháng 5/2024</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Đang xây dựng
                  </Badge>
                </div>
                <div className="text-center p-6 border border-[#d4c5a0] rounded-lg">
                  <MapPin className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
                  <h4 className="font-semibold text-[#573e1c] mb-2">Đà Nẵng</h4>
                  <p className="text-sm text-[#8b6a42] mb-3">Dự kiến: Tháng 7/2024</p>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Đang lên kế hoạch
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}