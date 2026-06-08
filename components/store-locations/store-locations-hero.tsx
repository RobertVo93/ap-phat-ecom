import { Badge } from '@/components/ui/badge';
import { StoreLocationsHeroProps } from './store-location-types';

export function StoreLocationsHero({ brandName, storeCount, t }: StoreLocationsHeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#573e1c] to-[#8b6a42] py-16 lg:py-24">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold text-[#efe1c1] mb-6">
          {t('store.locations')}
        </h1>
        <p className="text-xl text-[#d4c5a0] max-w-3xl mx-auto leading-relaxed">
          {t('store.locations.hero.subtitle').replace('{brand}', brandName)}
        </p>
        <div className="mt-8 flex justify-center">
          <Badge className="bg-[#efe1c1] text-[#573e1c] px-4 py-2 text-lg">
            {t('store.locations.hero.storeCount').replace('{count}', String(storeCount))}
          </Badge>
        </div>
      </div>
    </section>
  );
}
