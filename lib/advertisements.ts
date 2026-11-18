import { z } from 'zod';
import type { IAdSlide } from '@/types/ad-slide.interface';

const publicGallerySchema = z.object({
  images: z.array(z.object({
    id: z.string().uuid(),
    url: z.string().url().refine((url) => new URL(url).protocol === 'https:'),
  })).max(20),
});

export function getAdvertisementSlides(value: unknown): IAdSlide[] {
  const parsed = publicGallerySchema.safeParse(value);
  if (!parsed.success) return [];
  return parsed.data.images.map((image) => ({ id: image.id, src: image.url }));
}
