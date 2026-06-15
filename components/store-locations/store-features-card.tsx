import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreFeaturesCardProps } from './store-location-types';

export function StoreFeaturesCard({ features, t }: StoreFeaturesCardProps) {
  return (
    <Card className="hidden bg-white border-[#d4c5a0] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#573e1c]">{t('store.locations.features.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center space-x-3 p-4 border border-[#d4c5a0] rounded-lg">
              <feature.icon className="w-6 h-6 text-[#573e1c]" />
              <div>
                <h4 className="font-semibold text-[#573e1c] text-sm">{feature.title}</h4>
                <p className="text-xs text-[#8b6a42]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
