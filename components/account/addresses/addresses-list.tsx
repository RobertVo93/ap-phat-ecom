import { AddressCard } from './address-card';
import { AddressesEmptyState } from './addresses-empty-state';
import { AddressesListProps } from './address-page-types';

export function AddressesList({
  addresses,
  t,
  handleAddAddress,
  handleDeleteAddress,
  handleEditAddress,
  handleSetDefault,
}: AddressesListProps) {
  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <AddressesEmptyState t={t} handleAddAddress={handleAddAddress} />
      ) : (
        addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            t={t}
            handleDeleteAddress={handleDeleteAddress}
            handleEditAddress={handleEditAddress}
            handleSetDefault={handleSetDefault}
          />
        ))
      )}
    </div>
  );
}
