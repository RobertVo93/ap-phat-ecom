import { Dispatch, SetStateAction } from 'react';
import { IAddress } from '@/types/address.interface';

export type AddressTranslator = (key: string) => string;

export interface AddressesPageHeaderProps {
  editingAddress: IAddress | null;
  formData: IAddress;
  isDialogOpen: boolean;
  t: AddressTranslator;
  handleAddAddress: () => void;
  handleSaveAddress: () => void;
  setFormData: Dispatch<SetStateAction<IAddress>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export interface AddressDialogProps {
  editingAddress: IAddress | null;
  formData: IAddress;
  isDialogOpen: boolean;
  t: AddressTranslator;
  handleAddAddress: () => void;
  handleSaveAddress: () => void;
  setFormData: Dispatch<SetStateAction<IAddress>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export interface AddressFormProps {
  editingAddress: IAddress | null;
  formData: IAddress;
  t: AddressTranslator;
  handleSaveAddress: () => void;
  setFormData: Dispatch<SetStateAction<IAddress>>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export interface AddressCardProps {
  address: IAddress;
  t: AddressTranslator;
  handleDeleteAddress: (addressId: string) => void;
  handleEditAddress: (address: IAddress) => void;
  handleSetDefault: (addressId: string) => void;
}

export interface AddressesListProps {
  addresses: IAddress[];
  t: AddressTranslator;
  handleAddAddress: () => void;
  handleDeleteAddress: (addressId: string) => void;
  handleEditAddress: (address: IAddress) => void;
  handleSetDefault: (addressId: string) => void;
}

export interface AddressesEmptyStateProps {
  t: AddressTranslator;
  handleAddAddress: () => void;
}
