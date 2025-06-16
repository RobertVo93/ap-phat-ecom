import { StoreLocation } from '../types';

export const mockStoreLocations: StoreLocation[] = [
  {
    id: '1',
    name: 'Cửa hàng chính - Quận 1',
    nameEn: 'Main Store - District 1',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    addressEn: '123 Le Loi Street, Ben Nghe Ward, District 1, Ho Chi Minh City',
    phone: '028 3823 4567',
    email: 'contact@ricepaperstore.vn',
    hours: 'Thứ 2 - Chủ nhật: 7:00 - 21:00',
    hoursEn: 'Monday - Sunday: 7:00 AM - 9:00 PM',
    coordinates: {
      lat: 10.7769,
      lng: 106.7009
    }
  },
  {
    id: '2',
    name: 'Chi nhánh Tây Ninh',
    nameEn: 'Tay Ninh Branch',
    address: '456 Đường Cách Mạng Tháng 8, TP. Tây Ninh, Tây Ninh',
    addressEn: '456 Cach Mang Thang 8 Street, Tay Ninh City, Tay Ninh Province',
    phone: '0276 3842 123',
    email: 'tayninh@ricepaperstore.vn',
    hours: 'Thứ 2 - Chủ nhật: 6:00 - 20:00',
    hoursEn: 'Monday - Sunday: 6:00 AM - 8:00 PM',
    coordinates: {
      lat: 11.3103,
      lng: 106.0989
    }
  }
];