export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  categoryEn: string;
  variants: ProductVariant[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  features: string[];
  featuresEn: string[];
}

export interface ProductVariant {
  id: string;
  name: string;
  nameEn: string;
  price?: number;
  inStock: boolean;
  options: VariantOption[];
}

export interface VariantOption {
  type: 'size' | 'weight' | 'quantity';
  value: string;
  valueEn: string;
  priceModifier?: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedOptions: Record<string, string>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  preferredLanguage: 'vi' | 'en';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  addressEn: string;
  phone: string;
  email: string;
  hours: string;
  hoursEn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}