import { useAuth } from "@/lib/contexts/auth-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { apiAddAddress, apiDeleteAddress, apiGetAddresses, apiUpdateAddress } from "@/lib/httpclient/address.client";
import { IAddress } from "@/types/address.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useAddresses = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([])
  const [formData, setFormData] = useState<IAddress>({
    name: '',
    phone: '',
    street: '',
    ward: '',
    city: '',
    isDefault: false
  });

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: user?.fullName!,
      phone: user?.phone!,
      street: '',
      ward: '',
      city: '',
      isDefault: false
    });
    setIsDialogOpen(true);
  };

  const handleEditAddress = (address: IAddress) => {
    setEditingAddress(address);
    setFormData(address);
    setIsDialogOpen(true);
  };

  const handleUpdateAddress = async (addressData: IAddress) => {
    try {
      setLoading(true)
      const res = await apiUpdateAddress(addressData.id!, addressData)
      if (res) {
        toast.success(t("account.savedAddresses"))
        setAddresses(prev => {
          const updated = prev.map(address => {
            if (res.isDefault) {
              if (address.id === res.id) {
                return { ...address, ...res, isDefault: true };
              }
              return { ...address, isDefault: false };
            }

            if (address.id === res.id) {
              return { ...address, ...res };
            }

            return address;
          });

          return updated.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
        });
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAddress = async () => {
    try {
      setLoading(true)
      const isValid = Object.entries(formData).every(([key, value]) => {
        if (key === "isDefault") return true;
        return value !== "";
      });

      if (!isValid) {
        toast.error(t("account.mustFillTheForm"))
      }

      if (editingAddress) {
        // Update existing address
        handleUpdateAddress(formData)
        setIsDialogOpen(false)
      } else {
        // Add new address
        const res = await apiAddAddress(user?.customer?.id!, formData)
        if (res) {
          toast.success(t("account.savedAddresses"))
          setAddresses(prev => {
            if (res.isDefault) {
              return [
                { ...res, isDefault: true },
                ...prev.map(address => ({ ...address, isDefault: false })),
              ];
            }

            return [...prev, res];
          });
          setIsDialogOpen(false)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true)
      const res = await apiDeleteAddress(addressId)
      if (res) {
        toast.success(t('account.success'))
        setAddresses(prev => prev.filter(item => item.id !== addressId));
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      setLoading(true)
      const address = addresses.find(address => address.id === addressId)
      handleUpdateAddress({ ...address!, isDefault: true })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const res = await apiGetAddresses(user?.customer?.id!)
      setAddresses(
        [...res].sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
      );
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  return {
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
    handleSetDefault
  }
}