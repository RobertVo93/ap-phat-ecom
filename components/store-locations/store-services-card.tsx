import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreServicesCardProps } from './store-location-types';

export function StoreServicesCard({ services, t }: StoreServicesCardProps) {
  return (
    <Card className="hidden bg-white border-[#d4c5a0] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#573e1c]">{t('store.locations.services.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#573e1c] rounded-full"></div>
              <span className="text-[#8b6a42] text-sm">{service}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
