import type { Metadata } from 'next';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedProducts } from '@/components/home/featured-products';
import { AdCarousel } from '@/components/home/ad-carousel';
import { HeroSection } from '@/components/home/hero-section';
import { ProductPackagingImage } from '@/components/home/product-packaging-image';
import { env, HOME_PAGE_CONTENT, SITE_CONTENT } from '@/constants';
import { getHomePageData } from '@/lib/services/homePageService';
import type { IAdSlide } from '@/types/ad-slide.interface';

export const revalidate = 300;

const siteUrl = env.BASE_ZONE || SITE_CONTENT.defaultUrl;
const mockSlides: IAdSlide[] = Array.from({ length: 11 }, (_, index) => ({
  id: `mock-${index + 1}`,
  src: `/mock_${index + 1}.jpg`,
}));
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: HOME_PAGE_CONTENT.metadata.title,
  description: HOME_PAGE_CONTENT.metadata.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: HOME_PAGE_CONTENT.metadata.title,
    description: HOME_PAGE_CONTENT.metadata.description,
    url: '/',
    siteName: SITE_CONTENT.name,
    images: [
      {
        url: SITE_CONTENT.defaultOgImage,
        width: SITE_CONTENT.defaultOgImageWidth,
        height: SITE_CONTENT.defaultOgImageHeight,
        alt: HOME_PAGE_CONTENT.metadata.imageAlt,
      },
    ],
    locale: SITE_CONTENT.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_PAGE_CONTENT.metadata.title,
    description: HOME_PAGE_CONTENT.metadata.description,
    images: [SITE_CONTENT.defaultOgImage],
  },
};

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomePageData();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <AdCarousel slides={mockSlides} />
      <ProductPackagingImage />
    </main>
  );
}
