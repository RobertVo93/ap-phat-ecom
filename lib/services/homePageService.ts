import 'server-only';

import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { getAllCollections } from '@/lib/services/collectionService';
import { ICollection, IProduct } from '@/types';
import { getFeaturedProducts } from './productService';
import { getHomeAdvertisementSlides } from './advertisementPageService';
import type { IAdSlide } from '@/types/ad-slide.interface';

interface HomePageData {
  advertisements: IAdSlide[];
  categories: ICollection[];
  featuredProducts: IProduct[];
}

const serializeForClient = <T>(value: T): T => JSON.parse(JSON.stringify(value));


export async function getHomePageData(): Promise<HomePageData> {
  const advertisements = await getHomeAdvertisementSlides();
  try {
    await ensureDataSource();

    const [categories, featuredProducts] = await Promise.all([
      getAllCollections(),
      getFeaturedProducts(),
    ]);

    return serializeForClient({
      advertisements,
      categories,
      featuredProducts,
    });
  } catch (error) {
    console.error('Failed to load home page data', error);

    return {
      advertisements,
      categories: [],
      featuredProducts: [],
    };
  }
}
