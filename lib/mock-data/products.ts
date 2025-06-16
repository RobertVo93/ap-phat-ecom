import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bánh Tráng Nướng Tây Ninh',
    nameEn: 'Tay Ninh Grilled Rice Paper',
    description: 'Bánh tráng nướng truyền thống từ Tây Ninh, thơm ngon và giòn rụm. Được làm từ gạo tẻ nguyên chất theo công thức gia truyền.',
    descriptionEn: 'Traditional grilled rice paper from Tay Ninh, fragrant and crispy. Made from pure rice using family recipe.',
    price: 25000,
    originalPrice: 30000,
    discount: 17,
    images: [
      'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg',
      'https://images.pexels.com/photos/4331440/pexels-photo-4331440.jpeg',
      'https://images.pexels.com/photos/4331521/pexels-photo-4331521.jpeg'
    ],
    category: 'Bánh Tráng',
    categoryEn: 'Rice Paper',
    variants: [
      {
        id: 'v1',
        name: 'Gói nhỏ',
        nameEn: 'Small Pack',
        inStock: true,
        options: [
          { type: 'quantity', value: '20 tờ', valueEn: '20 sheets' },
          { type: 'weight', value: '200g', valueEn: '200g' }
        ]
      },
      {
        id: 'v2',
        name: 'Gói lớn',
        nameEn: 'Large Pack',
        price: 45000,
        inStock: true,
        options: [
          { type: 'quantity', value: '40 tờ', valueEn: '40 sheets' },
          { type: 'weight', value: '400g', valueEn: '400g' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Bánh tráng rất thơm và giòn, đúng vị truyền thống!',
        date: '2024-01-15',
        verified: true
      },
      {
        id: 'r2',
        customerName: 'Trần Thị B',
        rating: 4,
        comment: 'Chất lượng tốt, giao hàng nhanh. Sẽ mua lại!',
        date: '2024-01-10',
        verified: true
      }
    ],
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    features: [
      'Làm từ gạo tẻ nguyên chất',
      'Nướng than hoa truyền thống',
      'Không chất bảo quản',
      'Đóng gói chân không'
    ],
    featuresEn: [
      'Made from pure rice',
      'Traditional charcoal grilled',
      'No preservatives',
      'Vacuum packed'
    ]
  },
  {
    id: '2',
    name: 'Bánh Phở Hà Nội',
    nameEn: 'Hanoi Pho Noodles',
    description: 'Bánh phở tươi Hà Nội được làm từ bột gạo cao cấp, dai ngon và thấm vị nước dùng. Phù hợp cho món phở truyền thống.',
    descriptionEn: 'Fresh Hanoi pho noodles made from premium rice flour, chewy and absorbs broth well. Perfect for traditional pho.',
    price: 15000,
    images: [
      'https://images.pexels.com/photos/4331521/pexels-photo-4331521.jpeg',
      'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg'
    ],
    category: 'Bánh Phở',
    categoryEn: 'Pho Noodles',
    variants: [
      {
        id: 'v1',
        name: 'Bánh phở nhỏ',
        nameEn: 'Small noodles',
        inStock: true,
        options: [
          { type: 'size', value: '3mm', valueEn: '3mm' },
          { type: 'weight', value: '500g', valueEn: '500g' }
        ]
      },
      {
        id: 'v2',
        name: 'Bánh phở to',
        nameEn: 'Large noodles',
        price: 18000,
        inStock: true,
        options: [
          { type: 'size', value: '5mm', valueEn: '5mm' },
          { type: 'weight', value: '500g', valueEn: '500g' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Lê Văn C',
        rating: 5,
        comment: 'Bánh phở tươi ngon, đúng chuẩn Hà Nội!',
        date: '2024-01-12',
        verified: true
      }
    ],
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    features: [
      'Bánh phở tươi hàng ngày',
      'Bột gạo cao cấp',
      'Độ dai vừa phải',
      'Không chất tạo màu'
    ],
    featuresEn: [
      'Fresh daily noodles',
      'Premium rice flour',
      'Perfect texture',
      'No artificial coloring'
    ]
  },
  {
    id: '3',
    name: 'Bánh Tráng Cuốn Thịt Nướng',
    nameEn: 'Grilled Meat Roll Rice Paper',
    description: 'Bánh tráng mỏng dẻo chuyên dùng để cuốn thịt nướng, nem nướng. Làm từ bột gạo và bột năng nguyên chất.',
    descriptionEn: 'Thin and flexible rice paper specially for wrapping grilled meat and spring rolls. Made from pure rice and tapioca flour.',
    price: 20000,
    images: [
      'https://images.pexels.com/photos/4331440/pexels-photo-4331440.jpeg',
      'https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg'
    ],
    category: 'Bánh Tráng',
    categoryEn: 'Rice Paper',
    variants: [
      {
        id: 'v1',
        name: 'Gói 250g',
        nameEn: '250g Pack',
        inStock: true,
        options: [
          { type: 'weight', value: '250g', valueEn: '250g' },
          { type: 'quantity', value: '25 tờ', valueEn: '25 sheets' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Phạm Thị D',
        rating: 4,
        comment: 'Bánh tráng mỏng vừa, cuốn dễ không bị rách.',
        date: '2024-01-08',
        verified: true
      }
    ],
    rating: 4.6,
    reviewCount: 54,
    inStock: true,
    features: [
      'Bánh tráng mỏng dẻo',
      'Không bị rách khi cuốn',
      'Thấm nước nhanh',
      'Vị thanh ngọt tự nhiên'
    ],
    featuresEn: [
      'Thin and flexible',
      'No tearing when rolling',
      'Quick water absorption',
      'Natural sweet taste'
    ]
  },
  {
    id: '4',
    name: 'Bún Tươi Miền Nam',
    nameEn: 'Southern Fresh Rice Vermicelli',
    description: 'Bún tươi miền Nam được làm từ gạo thơm, sợi bún trắng mịn và mềm. Thích hợp cho bún bò Huế, bún thịt nướng.',
    descriptionEn: 'Southern fresh rice vermicelli made from fragrant rice, white fine and soft noodles. Suitable for Hue beef noodle soup and grilled meat vermicelli.',
    price: 12000,
    images: [
      'https://images.pexels.com/photos/4331521/pexels-photo-4331521.jpeg',
      'https://images.pexels.com/photos/4331440/pexels-photo-4331440.jpeg'
    ],
    category: 'Bún',
    categoryEn: 'Vermicelli',
    variants: [
      {
        id: 'v1',
        name: 'Gói 400g',
        nameEn: '400g Pack',
        inStock: true,
        options: [
          { type: 'weight', value: '400g', valueEn: '400g' }
        ]
      },
      {
        id: 'v2',
        name: 'Gói 800g',
        nameEn: '800g Pack',
        price: 22000,
        inStock: true,
        options: [
          { type: 'weight', value: '800g', valueEn: '800g' }
        ]
      }
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Võ Văn E',
        rating: 5,
        comment: 'Bún tươi ngon, sợi bún đều và mềm.',
        date: '2024-01-05',
        verified: true
      }
    ],
    rating: 4.7,
    reviewCount: 76,
    inStock: true,
    features: [
      'Sợi bún trắng mịn',
      'Làm từ gạo thơm',
      'Độ mềm vừa phải',
      'Không chất phụ gia'
    ],
    featuresEn: [
      'White fine noodles',
      'Made from fragrant rice',
      'Perfect softness',
      'No additives'
    ]
  }
];