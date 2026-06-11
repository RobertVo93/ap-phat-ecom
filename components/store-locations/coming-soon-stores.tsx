import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComingSoonStoresProps } from './store-location-types';

export function ComingSoonStores({ t }: ComingSoonStoresProps) {
  return (
    <div className="hidden mt-16">
      <Card className="bg-white border-[#d4c5a0] shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#573e1c] text-center text-2xl">{t('store.locations.comingSoon.title')}</CardTitle>
          <p className="text-center text-[#8b6a42]">
            {t('store.locations.comingSoon.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-[#d4c5a0] rounded-lg">
              <MapPin className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
              <h4 className="font-semibold text-[#573e1c] mb-2">{t('store.locations.comingSoon.hcm.location')}</h4>
              <p className="text-sm text-[#8b6a42] mb-3">{t('store.locations.comingSoon.hcm.eta')}</p>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {t('store.locations.comingSoon.openingSoon')}
              </Badge>
            </div>
            <div className="text-center p-6 border border-[#d4c5a0] rounded-lg">
              <MapPin className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
              <h4 className="font-semibold text-[#573e1c] mb-2">{t('store.locations.comingSoon.hanoi.location')}</h4>
              <p className="text-sm text-[#8b6a42] mb-3">{t('store.locations.comingSoon.hanoi.eta')}</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {t('store.locations.comingSoon.underConstruction')}
              </Badge>
            </div>
            <div className="text-center p-6 border border-[#d4c5a0] rounded-lg">
              <MapPin className="w-12 h-12 text-[#8b6a42] mx-auto mb-4" />
              <h4 className="font-semibold text-[#573e1c] mb-2">{t('store.locations.comingSoon.danang.location')}</h4>
              <p className="text-sm text-[#8b6a42] mb-3">{t('store.locations.comingSoon.danang.eta')}</p>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {t('store.locations.comingSoon.planning')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
