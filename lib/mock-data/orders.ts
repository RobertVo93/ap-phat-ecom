export const mockOrders = [{
    id: "ORD-001",
    orderNumber: "ORD-001",
    createdAt: '2024-01-15T10:30:00Z',
    status: 'shipping',
    deliveryDate: '2024-01-17',
    trackingNumber: 'VN123456789',
    carrier: 'Giao Hàng Nhanh',
    customerId: "1",
    subtotal: 135000,
    tax: 13500,
    shipping: 0,
    total: 148500,
    deliveryAddress: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      street: '123 Đường Lê Lợi',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      city: 'TP.HCM',
      id: '1',
      isDefault: true
    },
    items: [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Bánh Tráng Nướng Tây Ninh',
          nameEn: 'Tay Ninh Grilled Rice Paper',
          description: 'Bánh tráng nướng truyền thống từ Tây Ninh, thơm ngon và giòn rụm. Được làm từ gạo tẻ nguyên chất theo công thức gia truyền.',
          descriptionEn: 'Traditional grilled rice paper from Tay Ninh, fragrant and crispy. Made from pure rice using family recipe.',
          price: 25000,
          originalPrice: 30000,
          discount: 17,
          images: ['https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg'],
          category: 'Bánh',
          categoryEn: 'Bánh',
          variants: [],
          reviews: [],
          rating: 0,
          reviewCount: 0,
          inStock: true,
          features: [],
          featuresEn: []
        },
        selectedVariant: {
          id: '1',
          name: 'Gói lớn - 40 tờ',
          nameEn: 'Large pack - 40 sheets',
          price: 42500,
          inStock: true,
          options: []
        },
        selectedOptions: {},
        quantity: 2
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