export const DEFAULT_PRICE_RANGE: [number, number] = [0, 999_999_999]
export const MAX_CART_ITEM_QUANTITY = 999_999

export const SITE_CONTENT = {
  defaultUrl: 'https://www.anphat.io.vn',
  name: 'Cơ sở bánh tráng An Phát',
  locale: 'vi_VN',
  defaultOgImage: '/AP-logo.jpg',
  defaultOgImageWidth: 1200,
  defaultOgImageHeight: 630,
} as const

export const HOME_PAGE_CONTENT = {
  metadata: {
    title: 'Cơ sở bánh tráng An Phát | Bánh tráng gạo truyền thống Bình Định',
    description: 'Cơ sở bánh tráng An Phát cung cấp các loại bánh nhúng giòn rụm, ngon miệng. Giữ được hương vị truyền thống của bánh tráng gạo nhúng nước Bình Định chất lượng cao cho gia đình, nhà hàng và đại lý.',
    imageAlt: 'Logo Cơ sở bánh tráng An Phát',
  },
  hero: {
    badge: '100% Sản phẩm sạch, không chất bảo quản',
    title: 'Bánh Tráng gạo truyền thống',
    description: 'Trải nghiệm các loại bánh nhúng giòn rụm, ngon miệng. Giữ được hương vị truyền thống của bánh tráng gạo nhúng nước Bình Định',
    imageAlt: 'Bánh Tráng gạo truyền thống',
  },
  categories: {
    badges: {
      popular: 'Popular',
      new: 'New',
      hot: 'Hot',
    },
    productCountSuffix: 'sản phẩm',
  },
} as const

export const PRODUCT_DETAIL_PAGE_CONTENT = {
  notFoundTitle: 'Không tìm thấy sản phẩm',
  defaultDescriptionSuffix: 'Bánh tráng gạo truyền thống Bình Định chất lượng cao cho gia đình, nhà hàng và đại lý.',
  fallbackImageAltPrefix: 'Logo',
  productImageAltSeparator: ' - ',
  currency: 'VND',
  schema: {
    context: 'https://schema.org',
    productType: 'Product',
    brandType: 'Brand',
    offerType: 'Offer',
    inStock: 'https://schema.org/InStock',
    outOfStock: 'https://schema.org/OutOfStock',
    newCondition: 'https://schema.org/NewCondition',
  },
} as const
