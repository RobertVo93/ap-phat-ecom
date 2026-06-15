import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StoreOffersCardProps } from './store-location-types';

export function StoreOffersCard({ t }: StoreOffersCardProps) {
  return (
    <Card className="hidden bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] border-[#8b6a42] shadow-lg">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[#573e1c] mb-4">
            {t('store.locations.offers.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-[#8b6a42]">
              <h4 className="font-semibold text-[#573e1c] mb-2">{t('store.locations.offers.firstDiscount.title')}</h4>
              <p className="text-sm text-[#8b6a42]">{t('store.locations.offers.firstDiscount.description')}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#8b6a42]">
              <h4 className="font-semibold text-[#573e1c] mb-2">{t('store.locations.offers.freeShipping.title')}</h4>
              <p className="text-sm text-[#8b6a42]">{t('store.locations.offers.freeShipping.description')}</p>
            </div>
          </div>
          <Button className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]">
            {t('store.locations.offers.viewMore')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
