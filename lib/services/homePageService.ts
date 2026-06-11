import 'server-only';

import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { getAllCollections } from '@/lib/services/collectionService';
import { ICollection, IProduct } from '@/types';
import { getFeaturedProducts } from './productService';

interface HomePageData {
  categories: ICollection[];
  featuredProducts: IProduct[];
}

const serializeForClient = <T>(value: T): T => JSON.parse(JSON.stringify(value));


export async function getHomePageData(): Promise<HomePageData> {
  try {
    await ensureDataSource();

    const [categories, featuredProducts] = await Promise.all([
      getAllCollections(),
      getFeaturedProducts(),
    ]);

    return serializeForClient({
      categories,
      featuredProducts,
    });
  } catch (error) {
    console.error('Failed to load home page data', error);

    return {
      categories: [],
      featuredProducts: [],
    };
  }
}
