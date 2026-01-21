"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
} from "@/components/ui/select"
import { IAddress, IOrder } from "@/types"
import { useLanguage } from "@/lib/contexts/language-context"

interface Props {
  addresses: IAddress[]
  orderData: IOrder
  setOrderData: (data: IOrder) => void
  setDeliveryInfo: (value: React.SetStateAction<{
    address: string
    ward: string
    city: string
  }>) => void
}

export function AddressSelector({
  addresses,
  orderData,
  setOrderData,
  setDeliveryInfo,
}: Props) {
  const { t } = useLanguage()

  const handleChange = (addressId: string) => {
    const selectedAddress = addresses.find(a => a.id === addressId)
    if (!selectedAddress) return

    setOrderData({
      ...orderData,
      addressId: addressId,
      receiverInfo: {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
      },
    })

    setDeliveryInfo({
      address: selectedAddress.street!,
      ward: selectedAddress.ward!,
      city: selectedAddress.city!,
    })
  }

  const selectedAddress = addresses.find(
    a => a.id === orderData.addressId
  )

  const selectedValue = selectedAddress
    ? selectedAddress.id
    : undefined

  if (!addresses.length) return null

  return (
    <Select
      value={selectedValue}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-full h-auto items-start px-3 py-2">
        {selectedAddress ? (
          <div className="flex flex-col gap-0.5 text-left">
            <span className="font-medium leading-tight">
              {selectedAddress.name}
              {selectedAddress.isDefault && ` - ${t("account.default")}`}
            </span>
            <span className="text-sm text-muted-foreground leading-tight">
              {selectedAddress.street}, {selectedAddress.ward}, {selectedAddress.city}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            {t("checkout.selectCustomerInfo")}
          </span>
        )}
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {addresses.map(address => (
            <SelectItem key={address.id} value={address.id!}>
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {address.name}
                  {address.isDefault && ` - ${t("account.default")}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  {address.street}, {address.ward}, {address.city}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
