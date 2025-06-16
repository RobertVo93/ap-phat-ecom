import { Order } from '@/lib/types';

export const mockOrders: Order[] = [{
    id: "ORD-001",
    orderNumber: "ORD-001",
    date: '2024-01-15T10:30:00Z',
    status: 'shipping',
    estimatedDelivery: '2024-01-17',
    trackingNumber: 'VN123456789',
    carrier: 'Giao Hàng Nhanh',
    customer: {
      name: 'Nguyễn Văn A',
      email: 'user@example.com',
      phone: '0901234567'
    },
    deliveryAddress: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      street: '123 Đường Lê Lợi',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP.HCM'
    },
    items: [
      {
        id: '1',
        name: 'Bánh Tráng Nướng Tây Ninh',
        variant: 'Gói lớn - 40 tờ',
        quantity: 2,
        price: 45000,
        image: 'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg'
      },
      {
        id: '2',
        name: 'Bánh Phở Hà Nội',
        variant: 'Bánh phở nhỏ - 500g',
        quantity: 3,
        price: 15000,
        image: 'https://images.pexels.com/photos/4331521/pexels-photo-4331521.jpeg'
      }
    ],
    pricing: {
      subtotal: 135000,
      tax: 13500,
      shipping: 0,
      total: 148500
    },
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    notes: 'Giao hàng vào buổi chiều, gọi trước 15 phút',
    timeline: [
      {
        status: 'confirmed',
        title: 'Đơn hàng đã được xác nhận',
        description: 'Chúng tôi đã nhận và xác nhận đơn hàng của bạn',
        timestamp: '2024-01-15T10:30:00Z',
        completed: true
      },
      {
        status: 'preparing',
        title: 'Đang chuẩn bị hàng',
        description: 'Đơn hàng đang được đóng gói và chuẩn bị giao',
        timestamp: '2024-01-15T14:00:00Z',
        completed: true
      },
      {
        status: 'shipping',
        title: 'Đang giao hàng',
        description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
        timestamp: '2024-01-16T09:00:00Z',
        completed: true,
        current: true
      },
      {
        status: 'delivered',
        title: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao thành công',
        timestamp: null,
        completed: false
      }
    ]
  }];