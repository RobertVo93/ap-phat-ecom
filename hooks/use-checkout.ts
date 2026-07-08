import { useAuth } from "@/lib/contexts/auth-context"
import { useCart } from "@/lib/contexts/cart-context"
import { useLanguage } from "@/lib/contexts/language-context"
import { useRewards } from "@/lib/contexts/rewards-context"
import { createOrder as apiCreateOrder } from "@/lib/httpclient/order.client"
import { getNextBlockTime } from "@/lib/utils.date"
import { getLocalCustomer, updateLocalCustomer } from "@/lib/utils.localStorage"
import { ICartItem, IOrder, IOrderItem, OrderStatus, PaymentMethod, PaymentStatus } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useAddresses } from "./use-addresses"
import { env } from "@/constants"

const defaultOrderData: Partial<IOrder> = {
  deliveryDate: new Date(),
  totalAmount: 0,
  status: OrderStatus.pending,
  paymentStatus: PaymentStatus.pending,
  paymentMethod: PaymentMethod.cash,
  shippingAddress: "",
  items: [],
  notes: "",
  tags: [],
  receiverInfo: {
    name: "",
    phone: "",
  }
}

function mapCartItemsToOrderItems(cartItems: ICartItem[]): IOrderItem[] {
  return cartItems.map((item) => ({
    id: item.product?.id,
    quantity: item.quantity ?? 0,
    unitCost: item.price ?? 0,
    totalCost: item.subtotal ?? (item.price ?? 0) * (item.quantity ?? 0),
    product: item.product
  }));
}

export const useCheckout = () => {
  const { t } = useLanguage();
  const {
    addresses
  } = useAddresses()

  const [loading, setLoading] = useState<boolean>(false)
  const [orderData, setOrderData] = useState<IOrder>({ ...defaultOrderData, deliveryDate: getNextBlockTime(new Date()) })
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [voucherCode, setVoucherCode] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState('');

  const router = useRouter()

  const { items, getCartTotal, clearCart } = useCart();
  const { loyaltyPoints, vouchers, calculateDiscount, useVoucher, redeemPoints, addPoints } = useRewards();
  const { user } = useAuth()

  // Rewards state
  const subtotal = getCartTotal();
  const tax = subtotal * (parseInt(env.NEXT_PUBLIC_TAX_RATE));
  const shipping = 0;

  // Calculate discounts
  const discountCalculation = calculateDiscount(subtotal, appliedVoucher || undefined, pointsToRedeem);
  const total = subtotal + tax + shipping - discountCalculation.totalDiscount;

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    ward: '',
    city: 'TP.HCM',
  });

  const onSetPaymentMethod = (value: PaymentMethod) => {
    setOrderData({ ...orderData, paymentMethod: value })
  }

  const handleApplyVoucher = () => {
    setVoucherError('');

    if (!voucherCode.trim()) {
      setVoucherError(t('checkout.voucher.enterCode'));
      return;
    }

    const voucher = vouchers.find(v =>
      v.code.toUpperCase() === voucherCode.toUpperCase() &&
      !v.isUsed &&
      v.isActive &&
      subtotal >= v.minOrderAmount &&
      new Date(v.expiryDate) > new Date()
    );

    if (!voucher) {
      setVoucherError(t('checkout.voucher.invalid'));
      return;
    }

    setAppliedVoucher(voucherCode.toUpperCase());

    setVoucherCode('');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherError('');
  };

  const handlePointsChange = (change: number) => {
    const newPoints = Math.max(0, Math.min(loyaltyPoints, pointsToRedeem + change));
    setPointsToRedeem(newPoints);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (appliedVoucher) {
      handleApplyVoucher()
      const voucher = vouchers.find(v => v.code === appliedVoucher);
      if (voucher) {
        useVoucher(voucher.id);
      }
    }

    // Redeem points if used
    if (pointsToRedeem > 0) {
      redeemPoints(pointsToRedeem, `Sử dụng điểm cho đơn hàng`);
    }

    // Add points for this order (5% of subtotal)
    const orderId = `ORD-${Date.now()}`;
    addPoints(subtotal, orderId);

    // Create order
    createOrder(orderData)
  };

  const createOrder = async (orderData: Partial<IOrder>) => {
    try {
      setLoading(true)
      let shippingAddress = deliveryInfo.address
      if (deliveryInfo.ward) {
        shippingAddress += ` - ${deliveryInfo.ward}`
      }
      if (deliveryInfo.city) {
        shippingAddress += ` - ${deliveryInfo.city}`
      }

      const newOrder: IOrder = {
        deliveryDate: new Date(),
        totalAmount: orderData.totalAmount || 0,
        status: OrderStatus.pending,
        paymentStatus: PaymentStatus.pending,
        paymentMethod: orderData.paymentMethod || PaymentMethod.cash,
        shippingAddress: shippingAddress,
        notes: orderData.notes,
        tags: orderData.tags,
        shippingFee: shipping,
        tax: orderData.tax || tax,
        items: mapCartItemsToOrderItems(items),
        receiverInfo: orderData.receiverInfo
      }
      if (user) {
        newOrder.customer = user.customer
      }
      else {
        const customer = getLocalCustomer()
        newOrder.customer = {
          ...customer,
          name: customer?.name || orderData.receiverInfo?.name || 'Khách lẻ',
          phone: customer?.phone || orderData.receiverInfo?.phone || 'Chưa cập nhật',
          notes: customer?.notes || orderData.notes || '',
          location: customer?.location || newOrder.shippingAddress || '',
        }
        updateLocalCustomer(newOrder.customer);
      }
      const res = await apiCreateOrder(newOrder)
      if (res) {
        clearCart()
        if (user) {
          router.push(`/account/orders/${res.id}`)
        } else {
          const params = new URLSearchParams({ customerId: newOrder.customer?.id || '' });
          router.push(`/guest/orders/${res.id}?${params}`)
        }
      }
    } catch (e) {
      console.error(e)
      toast({
				title: t("common.error"),
				description: t("common.checkout.orderFailed"),
				variant: "destructive",
			})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (items) {
      setOrderData({ ...orderData, totalAmount: total })
    }
  }, [deliveryInfo, voucherCode, pointsToRedeem, appliedVoucher, voucherError])

  useEffect(() => {
    const customer = user?.customer || getLocalCustomer();
    const splitAddress = customer?.location?.split(' - ') || [];
    setOrderData({
      ...orderData,
      notes: customer?.notes || '',
      receiverInfo: {
        name: customer?.name || '',
        phone: customer?.phone || '',
      },
    });
    setDeliveryInfo({
      address: splitAddress[0] || '',
      ward: splitAddress[1] || '',
      city: splitAddress[2] || '',
    })
  }, [])

  useEffect(() => {
    if(addresses) {
      const defaultAddress = addresses.find(item => item.isDefault)
      if(defaultAddress) {
        setDeliveryInfo({
          address: defaultAddress.street!,
          ward: defaultAddress.ward!,
          city: defaultAddress.city!
        })
        setOrderData(prev => ({
          ...prev,
          addressId: defaultAddress.id,
          receiverInfo: {
            name: defaultAddress.name,
            phone: defaultAddress.phone,
          }
        }))
      }
    }
  }, [addresses])

  return {
    loading,
    orderData,
    deliveryInfo,
    agreeTerms,
    copiedField,
    voucherCode,
    voucherError,
    appliedVoucher,
    pointsToRedeem,
    discountCalculation,
    loyaltyPoints,
    total,
    subtotal,
    shipping,
    tax,
    addresses,
    copyToClipboard,
    handleRemoveVoucher,
    handleApplyVoucher,
    handlePlaceOrder,
    handlePointsChange,
    setVoucherCode,
    setAgreeTerms,
    setDeliveryInfo,
    setOrderData,
    onSetPaymentMethod,
  }
}
