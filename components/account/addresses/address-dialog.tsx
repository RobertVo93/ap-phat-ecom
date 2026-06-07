import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddressForm } from './address-form';
import { AddressDialogProps } from './address-page-types';

export function AddressDialog({
  editingAddress,
  formData,
  isDialogOpen,
  t,
  handleAddAddress,
  handleSaveAddress,
  setFormData,
  setIsDialogOpen,
}: AddressDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleAddAddress}
          className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('account.addNewAddress')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#573e1c]">
            {editingAddress ? t('account.editAddress') : t('account.addNewAddress')}
          </DialogTitle>
        </DialogHeader>
        <AddressForm
          editingAddress={editingAddress}
          formData={formData}
          t={t}
          handleSaveAddress={handleSaveAddress}
          setFormData={setFormData}
          setIsDialogOpen={setIsDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
