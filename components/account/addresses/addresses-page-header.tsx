import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressDialog } from './address-dialog';
import { AddressesPageHeaderProps } from './address-page-types';

export function AddressesPageHeader({
  editingAddress,
  formData,
  isDialogOpen,
  t,
  handleAddAddress,
  handleSaveAddress,
  setFormData,
  setIsDialogOpen,
}: AddressesPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          asChild
          variant="ghost"
          className="text-[#573e1c] hover:bg-[#efe1c1]"
        >
          <Link href="/account">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('account.backToAccount')}
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#573e1c]">
            {t('account.manageAddresses')}
          </h1>
        </div>
        <AddressDialog
          editingAddress={editingAddress}
          formData={formData}
          isDialogOpen={isDialogOpen}
          t={t}
          handleAddAddress={handleAddAddress}
          handleSaveAddress={handleSaveAddress}
          setFormData={setFormData}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </div>
  );
}
