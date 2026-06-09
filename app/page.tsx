import type { Metadata } from 'next';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { HeroSection } from '@/components/home/hero-section';
import { getHomePageData } from '@/lib/services/homePageService';

export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_BASE_ZONE || 'https://www.anphat.io.vn';
const homeDescription = 'Cơ sở bánh tráng An Phát cung cấp các loại bánh nhúng giòn rụm, ngon miệng. Giữ được hương vị truyền thống của bánh tráng gạo nhúng nước Bình Định chất lượng cao cho gia đình, nhà hàng và đại lý.';
const homeTitle = 'Cơ sở bánh tráng An Phát | Bánh tráng gạo truyền thống Bình Định';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: '/',
    siteName: 'Cơ sở bánh tráng An Phát',
    images: [
      {
        url: '/AP-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Logo Cơ sở bánh tráng An Phát',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
    images: ['/AP-logo.jpg'],
  },
};

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomePageData();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts featuredProducts={featuredProducts} />
    </main>
  );
}
