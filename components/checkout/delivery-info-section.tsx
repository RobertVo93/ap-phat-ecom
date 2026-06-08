import { FileText, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckoutFormStateProps } from '@/components/checkout/checkout-types';
import { useLanguage } from '@/lib/contexts/language-context';

export function DeliveryInfoSection({
  orderData,
  deliveryInfo,
  setOrderData,
  setDeliveryInfo,
}: CheckoutFormStateProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white border-[#d4c5a0] mb-6">
      <CardHeader>
        <CardTitle className="text-[#573e1c] flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          {t('checkout.deliveryInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#573e1c]">
              {t('checkout.form.fullName')} *
            </Label>
            <Input
              id="name"
              value={orderData.receiverInfo?.name}
              placeholder={t("checkout.form.customerName")}
              onChange={(e) =>
                setOrderData({
                  ...orderData,
                  receiverInfo: {
                    ...orderData.receiverInfo,
                    name: e.target.value,
                  },
                })
              }
              className="border-[#8b6a42] focus:border-[#573e1c]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#573e1c]">
              {t('checkout.form.phone')} *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={t("checkout.form.customerPhone")}
              value={orderData.receiverInfo?.phone || ""}
              onChange={(e) =>
                setOrderData({
                  ...orderData,
                  receiverInfo: {
                    ...orderData.receiverInfo,
                    phone: e.target.value,
                  },
                })
              }
              className="border-[#8b6a42] focus:border-[#573e1c]"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-[#573e1c]">{t('checkout.form.address')} *</Label>
          <Input
            id="address"
            value={deliveryInfo.address}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
            className="border-[#8b6a42] focus:border-[#573e1c]"
            placeholder={t('checkout.form.addressPlaceholder')}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ward" className="text-[#573e1c]">{t('checkout.form.ward')}</Label>
            <Input
              id="ward"
              value={deliveryInfo.ward}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, ward: e.target.value })}
              className="border-[#8b6a42] focus:border-[#573e1c]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-[#573e1c]">{t('checkout.form.city')}</Label>
            <Input
              id="city"
              value={deliveryInfo.city}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
              className="border-[#8b6a42] focus:border-[#573e1c]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-[#573e1c] flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            {t('checkout.form.note')}
          </Label>
          <Textarea
            id="notes"
            value={orderData.notes}
            onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
            className="border-[#8b6a42] focus:border-[#573e1c]"
            placeholder={t('checkout.form.notePlaceholder')}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
