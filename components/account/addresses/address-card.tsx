import { Edit, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddressCardProps } from './address-page-types';
import { useMemo } from 'react';
import { addressToString } from '@/lib/utils';

export function AddressCard({
  address,
  t,
  handleDeleteAddress,
  handleEditAddress,
  handleSetDefault,
}: AddressCardProps) {
  const addressStr = useMemo(() => {
      return addressToString(address)
  }, [address]);
  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {address.isDefault ? (
                <Badge className="bg-[#573e1c] text-[#efe1c1]">
                  <Star className="w-3 h-3 mr-1" />
                  {t('account.default')}
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(address.id!)}
                  className="pl-0 text-[#573e1c] hover:bg-[#efe1c1]"
                >
                  <Star className="w-4 h-4 mr-1" />
                  {t('account.setDefault')}
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditAddress(address)}
              className="text-[#573e1c] hover:bg-[#efe1c1]"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteAddress(address.id!)}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div>
            <h3 className="font-semibold text-[#573e1c]">{address.name}</h3>
            <div className="flex justify-between">
              <span className="text-[#8b6a42] min-w-[120px]">{t('account.phoneNumber')}:</span>
              <span className="font-semibold text-[#573e1c]">{address.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b6a42] min-w-[120px]">{t('account.location')}:</span>
              <span className="font-semibold text-[#573e1c]" title={addressStr}>{addressStr}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
