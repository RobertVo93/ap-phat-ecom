import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressFormProps } from './address-page-types';

export function AddressForm({
  editingAddress,
  formData,
  t,
  handleSaveAddress,
  setFormData,
  setIsDialogOpen,
}: AddressFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSaveAddress}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#573e1c]">{t('account.fullName')}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            className="border-[#8b6a42] focus:border-[#573e1c]"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[#573e1c]">{t('account.phoneNumber')} *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            className="border-[#8b6a42] focus:border-[#573e1c]"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="street" className="text-[#573e1c]">{t('account.streetAddress')} *</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(event) => setFormData({ ...formData, street: event.target.value })}
          className="border-[#8b6a42] focus:border-[#573e1c]"
          placeholder={t('account.streetPlaceholder')}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ward" className="text-[#573e1c]">{t('account.ward')}</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(event) => setFormData({ ...formData, ward: event.target.value })}
            className="border-[#8b6a42] focus:border-[#573e1c]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-[#573e1c]">{t('account.city')}</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(event) => setFormData({ ...formData, city: event.target.value })}
            className="border-[#8b6a42] focus:border-[#573e1c]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => setFormData({ ...formData, isDefault: !!checked })}
        />
        <Label htmlFor="isDefault" className="text-[#8b6a42]">
          {t('account.setAsDefault')}
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(false)}
          className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
        >
          {t('account.cancel')}
        </Button>
        <Button
          type='submit'
          className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1]"
        >
          {editingAddress ? t('account.update') : t('account.addAddress')}
        </Button>
      </div>
    </form>
  );
}
