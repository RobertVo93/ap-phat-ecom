import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { ensureDataSource } from '@/lib/database/ensureDataSource';
import { getAdvertisementSlides } from '@/lib/advertisements';
import type { IAdSlide } from '@/types/ad-slide.interface';

export async function getHomeAdvertisementSlides(): Promise<IAdSlide[]> {
  // Admin and ecom share settings; read the current order on each page request.
  noStore();
  try {
    const dataSource = await ensureDataSource();
    const rows: Array<{ value: unknown }> = await dataSource.query(
      'SELECT value FROM settings WHERE config_type = $1 AND key = $2 LIMIT 1',
      ['advertisements', 'gallery'],
    );
    return getAdvertisementSlides(rows[0]?.value);
  } catch (error) {
    console.error('[advertisementPageService.getHomeAdvertisementSlides] Failed to load images', error);
    return [];
  }
}
