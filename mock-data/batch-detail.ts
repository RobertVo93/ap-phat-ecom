import { IBatchDetailComplete } from '@/types/batch.interface';

export const mockBatchDetail: IBatchDetailComplete = {
  id: 'BT-20241215-001',
  batchNumber: 'BT-20241215-001',
  productionDate: '2024-12-15T06:00:00Z',
  expiryDate: '2024-12-22T23:59:59Z',
  packageNumber: '045',
  totalPackages: 100,
  status: 'in_transit',
  qrCode: 'QR-BT-20241215-001-045',
  
  ingredients: [
    {
      id: 'ing-001',
      name: 'Gạo tẻ',
      nameEn: 'Rice',
      weight: 850,
      unit: 'g',
      percentage: 85,
      origin: {
        supplier: 'Hợp tác xã Nông nghiệp Tây Ninh',
        supplierEn: 'Tay Ninh Agricultural Cooperative',
        region: 'Tây Ninh, Việt Nam',
        regionEn: 'Tay Ninh, Vietnam',
        description: 'Gạo tẻ chất lượng cao được trồng theo phương pháp hữu cơ',
        descriptionEn: 'High-quality rice grown using organic farming methods',
        certifications: ['Chứng nhận hữu cơ VietGAP', 'ISO 22000'],
        certificationsEn: ['VietGAP Organic Certification', 'ISO 22000']
      }
    },
    {
      id: 'ing-002',
      name: 'Bột năng',
      nameEn: 'Tapioca Starch',
      weight: 120,
      unit: 'g',
      percentage: 12,
      origin: {
        supplier: 'Công ty TNHH Bột năng Đồng Nai',
        supplierEn: 'Dong Nai Tapioca Starch Co., Ltd',
        region: 'Đồng Nai, Việt Nam',
        regionEn: 'Dong Nai, Vietnam',
        description: 'Bột năng nguyên chất từ củ sắn tươi',
        descriptionEn: 'Pure tapioca starch from fresh cassava roots',
        certifications: ['HACCP', 'FDA Approved'],
        certificationsEn: ['HACCP', 'FDA Approved']
      }
    },
    {
      id: 'ing-003',
      name: 'Muối biển',
      nameEn: 'Sea Salt',
      weight: 25,
      unit: 'g',
      percentage: 2.5,
      origin: {
        supplier: 'Muối biển Cà Mau',
        supplierEn: 'Ca Mau Sea Salt',
        region: 'Cà Mau, Việt Nam',
        regionEn: 'Ca Mau, Vietnam',
        description: 'Muối biển tự nhiên được khai thác từ vùng biển Cà Mau',
        descriptionEn: 'Natural sea salt harvested from Ca Mau coastal waters',
        certifications: ['Chứng nhận tự nhiên'],
        certificationsEn: ['Natural Certification']
      }
    },
    {
      id: 'ing-004',
      name: 'Nước tinh khiết',
      nameEn: 'Purified Water',
      weight: 5,
      unit: 'ml',
      percentage: 0.5,
      origin: {
        supplier: 'Hệ thống lọc nước RO nội bộ',
        supplierEn: 'Internal RO Water Filtration System',
        region: 'Nhà máy sản xuất',
        regionEn: 'Production Facility',
        description: 'Nước được lọc qua hệ thống RO 7 cấp độ',
        descriptionEn: 'Water filtered through 7-stage RO system',
        certifications: ['Tiêu chuẩn nước uống'],
        certificationsEn: ['Drinking Water Standards']
      }
    }
  ],

  productionSteps: [
    {
      id: 'step-001',
      step: 1,
      title: 'Ngâm và rửa gạo',
      titleEn: 'Rice Soaking and Washing',
      description: 'Gạo được ngâm trong nước sạch 4-6 giờ, sau đó rửa sạch nhiều lần',
      descriptionEn: 'Rice is soaked in clean water for 4-6 hours, then washed thoroughly multiple times',
      duration: '6 giờ',
      temperature: '25°C',
      timestamp: '2024-12-15T06:00:00Z',
      status: 'completed',
      equipment: 'Bể ngâm inox 304',
      equipmentEn: '304 Stainless Steel Soaking Tank',
      qualityCheck: {
        passed: true,
        inspector: 'Nguyễn Văn A',
        notes: 'Gạo sạch, không có tạp chất',
        notesEn: 'Clean rice, no impurities detected',
        timestamp: '2024-12-15T12:00:00Z'
      }
    },
    {
      id: 'step-002',
      step: 2,
      title: 'Xay nhuyễn',
      titleEn: 'Grinding',
      description: 'Gạo đã ngâm được xay nhuyễn thành bột mịn với tỷ lệ nước phù hợp',
      descriptionEn: 'Soaked rice is ground into fine flour with appropriate water ratio',
      duration: '2 giờ',
      temperature: '30°C',
      timestamp: '2024-12-15T12:30:00Z',
      status: 'completed',
      equipment: 'Máy xay công nghiệp',
      equipmentEn: 'Industrial Grinding Machine',
      qualityCheck: {
        passed: true,
        inspector: 'Trần Thị B',
        notes: 'Độ mịn đạt tiêu chuẩn, không có cục',
        notesEn: 'Fineness meets standards, no lumps detected',
        timestamp: '2024-12-15T14:30:00Z'
      }
    },
    {
      id: 'step-003',
      step: 3,
      title: 'Lọc và pha trộn',
      titleEn: 'Filtering and Mixing',
      description: 'Bột gạo được lọc qua rây mịn và pha trộn với bột năng, muối',
      descriptionEn: 'Rice flour is filtered through fine mesh and mixed with tapioca starch and salt',
      duration: '1 giờ',
      temperature: '25°C',
      timestamp: '2024-12-15T14:45:00Z',
      status: 'completed',
      equipment: 'Máy trộn tự động',
      equipmentEn: 'Automatic Mixing Machine',
      qualityCheck: {
        passed: true,
        inspector: 'Lê Văn C',
        notes: 'Hỗn hợp đồng nhất, tỷ lệ chính xác',
        notesEn: 'Mixture is homogeneous, accurate proportions',
        timestamp: '2024-12-15T15:45:00Z'
      }
    },
    {
      id: 'step-004',
      step: 4,
      title: 'Nấu và tráng bánh',
      titleEn: 'Cooking and Sheet Formation',
      description: 'Hỗn hợp được nấu và tráng thành từng tờ bánh mỏng đều',
      descriptionEn: 'Mixture is cooked and formed into thin, even sheets',
      duration: '4 giờ',
      temperature: '85-90°C',
      timestamp: '2024-12-15T16:00:00Z',
      status: 'completed',
      equipment: 'Máy tráng bánh tự động',
      equipmentEn: 'Automatic Sheet Forming Machine',
      qualityCheck: {
        passed: true,
        inspector: 'Phạm Thị D',
        notes: 'Độ dày đều, màu sắc tự nhiên',
        notesEn: 'Even thickness, natural color',
        timestamp: '2024-12-15T20:00:00Z'
      }
    },
    {
      id: 'step-005',
      step: 5,
      title: 'Sấy khô',
      titleEn: 'Drying',
      description: 'Bánh tráng được sấy khô tự nhiên dưới ánh nắng mặt trời',
      descriptionEn: 'Rice papers are naturally dried under sunlight',
      duration: '8 giờ',
      temperature: '35-40°C',
      timestamp: '2024-12-15T20:30:00Z',
      status: 'completed',
      equipment: 'Giàn phơi ngoài trời',
      equipmentEn: 'Outdoor Drying Racks',
      qualityCheck: {
        passed: true,
        inspector: 'Võ Văn E',
        notes: 'Độ ẩm đạt tiêu chuẩn 12%',
        notesEn: 'Moisture content meets 12% standard',
        timestamp: '2024-12-16T04:30:00Z'
      }
    },
    {
      id: 'step-006',
      step: 6,
      title: 'Đóng gói',
      titleEn: 'Packaging',
      description: 'Bánh tráng được đóng gói vào túi chân không với nhãn mác đầy đủ',
      descriptionEn: 'Rice papers are vacuum-packed with complete labeling',
      duration: '2 giờ',
      temperature: '25°C',
      timestamp: '2024-12-16T05:00:00Z',
      status: 'completed',
      equipment: 'Máy đóng gói chân không',
      equipmentEn: 'Vacuum Packaging Machine',
      qualityCheck: {
        passed: true,
        inspector: 'Hoàng Thị F',
        notes: 'Bao bì kín, nhãn mác rõ ràng',
        notesEn: 'Sealed packaging, clear labeling',
        timestamp: '2024-12-16T07:00:00Z'
      }
    }
  ],

  transportationHistory: [
    {
      id: 'trans-001',
      status: 'picked_up',
      location: 'Nhà máy sản xuất',
      locationEn: 'Production Facility',
      distributor: {
        name: 'Nhà máy Rice & Noodles',
        nameEn: 'Rice & Noodles Factory',
        address: '456 Đường Cách Mạng Tháng 8, TP. Tây Ninh, Tây Ninh',
        addressEn: '456 Cach Mang Thang 8 Street, Tay Ninh City, Tay Ninh',
        phone: '0276 3842 123',
        email: 'factory@ricepaperstore.vn',
        type: 'warehouse'
      },
      timestamp: '2024-12-16T07:30:00Z',
      notes: 'Sản phẩm hoàn thành và sẵn sàng vận chuyển',
      notesEn: 'Product completed and ready for shipment',
      temperature: '25°C',
      humidity: '60%'
    },
    {
      id: 'trans-002',
      status: 'in_transit',
      location: 'Trung tâm phân phối miền Nam',
      locationEn: 'Southern Distribution Center',
      distributor: {
        name: 'Kho phân phối TP.HCM',
        nameEn: 'Ho Chi Minh City Distribution Warehouse',
        address: '789 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
        addressEn: '789 Nguyen Van Linh Street, District 7, Ho Chi Minh City',
        phone: '028 3456 7890',
        email: 'warehouse.hcm@ricepaperstore.vn',
        type: 'distributor'
      },
      timestamp: '2024-12-16T14:00:00Z',
      notes: 'Đang vận chuyển đến cửa hàng bán lẻ',
      notesEn: 'In transit to retail store',
      temperature: '22°C',
      humidity: '55%'
    },
    {
      id: 'trans-003',
      status: 'delivered',
      location: 'Cửa hàng bán lẻ',
      locationEn: 'Retail Store',
      distributor: {
        name: 'Cửa hàng Rice & Noodles Quận 1',
        nameEn: 'Rice & Noodles Store District 1',
        address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
        addressEn: '123 Le Loi Street, Ben Nghe Ward, District 1, Ho Chi Minh City',
        phone: '028 3823 4567',
        email: 'store.q1@ricepaperstore.vn',
        type: 'retailer'
      },
      timestamp: '2024-12-16T18:30:00Z',
      notes: 'Đã giao hàng thành công đến cửa hàng',
      notesEn: 'Successfully delivered to store',
      temperature: '24°C',
      humidity: '58%'
    }
  ],

  qualityAssurance: {
    certifications: [
      'ISO 22000:2018 - Hệ thống quản lý an toàn thực phẩm',
      'HACCP - Phân tích mối nguy và điểm kiểm soát tới hạn',
      'VietGAP - Thực hành nông nghiệp tốt Việt Nam',
      'FDA - Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ'
    ],
    certificationsEn: [
      'ISO 22000:2018 - Food Safety Management System',
      'HACCP - Hazard Analysis and Critical Control Points',
      'VietGAP - Vietnam Good Agricultural Practices',
      'FDA - Food and Drug Administration USA'
    ],
    testResults: [
      {
        testType: 'Kiểm tra vi sinh',
        testTypeEn: 'Microbiological Testing',
        result: 'Đạt tiêu chuẩn',
        resultEn: 'Meets Standards',
        standard: 'TCVN 7046:2002',
        passed: true,
        timestamp: '2024-12-16T06:00:00Z'
      },
      {
        testType: 'Kiểm tra độ ẩm',
        testTypeEn: 'Moisture Content Testing',
        result: '12% (Đạt)',
        resultEn: '12% (Pass)',
        standard: '≤ 14%',
        passed: true,
        timestamp: '2024-12-16T06:15:00Z'
      },
      {
        testType: 'Kiểm tra kim loại nặng',
        testTypeEn: 'Heavy Metal Testing',
        result: 'Không phát hiện',
        resultEn: 'Not Detected',
        standard: 'WHO Guidelines',
        passed: true,
        timestamp: '2024-12-16T06:30:00Z'
      }
    ]
  },

  nutritionalInfo: {
    servingSize: '100g',
    calories: 334,
    protein: 5.8,
    carbohydrates: 83.1,
    fat: 0.3,
    fiber: 1.4,
    sodium: 8,
    unit: 'g'
  }
};