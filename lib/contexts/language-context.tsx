'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.about': 'Giới thiệu',
    'nav.contact': 'Liên hệ',
    'nav.cart': 'Giỏ hàng',
    'nav.account': 'Tài khoản',
    'nav.login': 'Đăng nhập',
    'nav.register': 'Đăng ký',
    'nav.logout': 'Đăng xuất',
    
    // Homepage
    'home.hero.title': 'Bánh Tráng & Bún Phở Truyền Thống',
    'home.hero.subtitle': 'Hương vị đậm đà từ miền quê Việt Nam',
    'home.hero.cta': 'Khám phá ngay',
    'home.categories.title': 'Danh mục sản phẩm',
    'home.featured.title': 'Sản phẩm nổi bật',
    'home.search.placeholder': 'Tìm kiếm sản phẩm...',
    
    // Products
    'product.addToCart': 'Thêm vào giỏ',
    'product.outOfStock': 'Hết hàng',
    'product.price': 'Giá',
    'product.originalPrice': 'Giá gốc',
    'product.discount': 'Giảm',
    'product.reviews': 'đánh giá',
    'product.rating': 'Đánh giá',
    'product.features': 'Đặc điểm',
    'product.description': 'Mô tả',
    'product.variants': 'Lựa chọn',
    
    // Cart
    'cart.title': 'Giỏ hàng',
    'cart.empty': 'Giỏ hàng trống',
    'cart.quantity': 'Số lượng',
    'cart.remove': 'Xóa',
    'cart.subtotal': 'Tạm tính',
    'cart.tax': 'Thuế VAT',
    'cart.shipping': 'Phí vận chuyển',
    'cart.total': 'Tổng cộng',
    'cart.checkout': 'Thanh toán',
    
    // Checkout
    'checkout.title': 'Thanh toán',
    'checkout.customerInfo': 'Thông tin khách hàng',
    'checkout.deliveryInfo': 'Thông tin giao hàng',
    'checkout.paymentInfo': 'Thông tin thanh toán',
    'checkout.orderSummary': 'Tóm tắt đơn hàng',
    'checkout.placeOrder': 'Đặt hàng',
    
    // Account
    'account.dashboard': 'Bảng điều khiển',
    'account.profile': 'Hồ sơ',
    'account.orders': 'Đơn hàng',
    'account.addresses': 'Địa chỉ',
    'account.settings': 'Cài đặt',
    
    // Store
    'store.title': 'Cửa hàng',
    'store.locations': 'Địa điểm',
    'store.hours': 'Giờ mở cửa',
    'store.contact': 'Liên hệ',
    
    // Common
    'common.loading': 'Đang tải...',
    'common.error': 'Có lỗi xảy ra',
    'common.success': 'Thành công',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.back': 'Quay lại',
    'common.next': 'Tiếp theo',
    'common.previous': 'Trước',
    'common.viewAll': 'Xem tất cả'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Homepage
    'home.hero.title': 'Traditional Rice Paper & Noodles',
    'home.hero.subtitle': 'Authentic flavors from Vietnamese countryside',
    'home.hero.cta': 'Explore Now',
    'home.categories.title': 'Product Categories',
    'home.featured.title': 'Featured Products',
    'home.search.placeholder': 'Search products...',
    
    // Products
    'product.addToCart': 'Add to Cart',
    'product.outOfStock': 'Out of Stock',
    'product.price': 'Price',
    'product.originalPrice': 'Original Price',
    'product.discount': 'Off',
    'product.reviews': 'reviews',
    'product.rating': 'Rating',
    'product.features': 'Features',
    'product.description': 'Description',
    'product.variants': 'Options',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Cart is empty',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'VAT Tax',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.customerInfo': 'Customer Information',
    'checkout.deliveryInfo': 'Delivery Information',
    'checkout.paymentInfo': 'Payment Information',
    'checkout.orderSummary': 'Order Summary',
    'checkout.placeOrder': 'Place Order',
    
    // Account
    'account.dashboard': 'Dashboard',
    'account.profile': 'Profile',
    'account.orders': 'Orders',
    'account.addresses': 'Addresses',
    'account.settings': 'Settings',
    
    // Store
    'store.title': 'Store',
    'store.locations': 'Locations',
    'store.hours': 'Hours',
    'store.contact': 'Contact',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.viewAll': 'View All'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['vi', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}