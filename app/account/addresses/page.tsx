'use client';

import React from 'react';
import { AddressesList, AddressesPageHeader } from '@/components/account/addresses';
import { LoadingOverlay } from '@/components/common/LoadOverlay';
import { useLanguage } from '@/lib/contexts/language-context';
import { useAddresses } from '@/hooks/use-addresses';

export default function AddressesPage() {
  const { t } = useLanguage();
  const {
    loading,
    user,
    addresses,
    editingAddress,
    formData,
    isDialogOpen,
    setFormData,
    setIsDialogOpen,
    handleAddAddress,
    handleEditAddress,
    handleSaveAddress,
    handleDeleteAddress,
    handleSetDefault,
  } = useAddresses();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <LoadingOverlay loading={loading} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AddressesPageHeader
          editingAddress={editingAddress}
          formData={formData}
          isDialogOpen={isDialogOpen}
          t={t}
          handleAddAddress={handleAddAddress}
          handleSaveAddress={handleSaveAddress}
          setFormData={setFormData}
          setIsDialogOpen={setIsDialogOpen}
        />

        <AddressesList
          addresses={addresses}
          t={t}
          handleAddAddress={handleAddAddress}
          handleDeleteAddress={handleDeleteAddress}
          handleEditAddress={handleEditAddress}
          handleSetDefault={handleSetDefault}
        />
      </div>
    </div>
  );
}
