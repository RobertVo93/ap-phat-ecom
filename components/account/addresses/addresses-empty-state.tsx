import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddressesEmptyStateProps } from './address-page-types';

export function AddressesEmptyState({ t, handleAddAddress }: AddressesEmptyStateProps) {
  return (
    <Card className="bg-white border-[#d4c5a0]">
      <CardContent className="p-12 text-center">
        <MapPin className="w-16 h-16 text-[#8b6a42] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[#573e1c] mb-2">
          {t('account.noAddresses')}
        </h3>
        <p className="text-[#8b6a42] mb-6">
          {t('account.addFirstAddress')}
        </p>
        <Button
          onClick={handleAddAddress}
          className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('account.addFirstAddressBtn')}
        </Button>
      </CardContent>
    </Card>
  );
}
