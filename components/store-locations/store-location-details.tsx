import Link from 'next/link';
import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreLocationDetailsProps } from './store-location-types';

const MAP_LATITUDE = 14.19053562479765;
const MAP_LONGITUDE = 109.01629465767265;

export function StoreLocationDetails({
  mapUrl,
  selectedStore,
  t,
}: StoreLocationDetailsProps) {
  const selectedStorePhoneHref = `tel:${selectedStore.phone.replace(/[^\d+]/g, '')}`;

  return (
    <Card className="bg-white border-[#d4c5a0] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#573e1c] text-2xl flex items-center">
          <MapPin className="w-6 h-6 mr-3" />
          {selectedStore.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Link
          href={mapUrl}
          target="_blank"
          className="block w-full h-[300px]"
        >
          <iframe
            src={`https://www.google.com/maps?output=embed&q=${MAP_LATITUDE},${MAP_LONGITUDE}`}
            className="w-full h-full rounded-xl pointer-events-none"
            loading="lazy"
          />
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg">
            <Phone className="w-5 h-5 text-[#573e1c]" />
            <div>
              <p className="font-semibold text-[#573e1c] text-sm">{t('store.locations.details.phone')}</p>
              <a href={`tel:${selectedStore.phone?.replace(/\s+/g, '')}`} className="text-[#8b6a42] text-sm">
                <span>{selectedStore.phone}</span>
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg">
            <Mail className="w-5 h-5 text-[#573e1c]" />
            <div>
              <p className="font-semibold text-[#573e1c] text-sm">{t('store.locations.details.email')}</p>
              <a href={`mailto:${selectedStore.email}`} className="text-[#8b6a42] text-sm">
                <span>{selectedStore.email}</span>
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-[#f8f5f0] rounded-lg">
            <Clock className="w-5 h-5 text-[#573e1c]" />
            <div>
              <p className="font-semibold text-[#573e1c] text-sm">{t('store.locations.details.openingHours')}</p>
              <p className="text-[#8b6a42] text-sm">
                {selectedStore.hours}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
            onClick={() => window.open(mapUrl, '_blank')}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {t('store.locations.details.directions')}
          </Button>
          <Button asChild variant="outline" className="flex-1 border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]">
            <a href={selectedStorePhoneHref}>
              <Phone className="w-4 h-4 mr-2" />
              {t('store.locations.details.call')}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
