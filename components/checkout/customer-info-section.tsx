import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressSelector } from '@/components/checkout/address-selector';
import { CheckoutCustomerSectionProps } from '@/components/checkout/checkout-types';
import { useLanguage } from '@/lib/contexts/language-context';
import { cn } from '@/lib/utils';

export function CustomerInfoSection({
  addresses,
  orderData,
  setOrderData,
  setDeliveryInfo,
}: CheckoutCustomerSectionProps) {
  const { t } = useLanguage();

  return (
    <Card className={cn("bg-white mb-6 border-[#d4c5a0]", addresses?.length === 0 && "hidden")}>
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          {t('checkout.selectCustomerInfo')}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <AddressSelector
          orderData={orderData}
          setOrderData={setOrderData}
          setDeliveryInfo={setDeliveryInfo}
          addresses={addresses}
        />
      </CardContent>
    </Card>
  );
}
