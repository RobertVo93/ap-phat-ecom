import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StoreLocationListProps } from './store-location-types';

export function StoreLocationList({
  selectedStoreId,
  stores,
  t,
  setSelectedStoreId,
}: StoreLocationListProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      <h2 className="text-2xl font-bold text-[#573e1c] mb-6">{t('store.locations.list.title')}</h2>
      {stores.map((store) => (
        <Card
          key={store.id}
          className={`cursor-pointer transition-all duration-300 ${selectedStoreId === store.id
            ? 'border-[#573e1c] ring-2 ring-[#573e1c] ring-opacity-50 bg-[#efe1c1]'
            : 'border-[#d4c5a0] hover:border-[#8b6a42] bg-white'
            }`}
          onClick={() => setSelectedStoreId(store.id)}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-[#573e1c] rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#efe1c1]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#573e1c] mb-2">
                  {store.name}
                </h3>
                <p className="text-sm text-[#8b6a42] mb-2">
                  {store.address || store.addressEn}
                </p>
                <div className="flex items-center text-xs text-[#8b6a42]">
                  <Clock className="w-3 h-3 mr-1" />
                  {store.hours}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
