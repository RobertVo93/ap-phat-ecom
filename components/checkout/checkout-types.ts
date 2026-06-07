import { Dispatch, FormEvent, SetStateAction } from 'react';
import { IAddress, ICartItem, IOrder, PaymentMethod } from '@/types';

export interface DeliveryInfo {
  address: string;
  ward: string;
  city: string;
}

export interface DiscountCalculation {
  voucherDiscount: number;
  pointsDiscount: number;
  totalDiscount: number;
  finalAmount?: number;
}

export interface PaymentAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
}

export interface MomoAccountInfo {
  phoneNumber: string;
  accountName: string;
}

export interface CheckoutFormStateProps {
  orderData: IOrder;
  deliveryInfo: DeliveryInfo;
  setOrderData: Dispatch<SetStateAction<IOrder>>;
  setDeliveryInfo: Dispatch<SetStateAction<DeliveryInfo>>;
}

export interface CheckoutOrderSummaryProps {
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  agreeTerms: boolean;
  voucherCode: string;
  voucherError: string;
  appliedVoucher: string | null;
  pointsToRedeem: number;
  discountCalculation: DiscountCalculation;
  loyaltyPoints: number;
  onVoucherCodeChange: (value: string) => void;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
  onPointsChange: (change: number) => void;
  onAgreeTermsChange: (value: boolean) => void;
}

export interface CheckoutPaymentSectionProps {
  paymentMethod?: PaymentMethod;
  copiedField: string | null;
  total: number;
  bankInfo: PaymentAccountInfo;
  momoInfo: MomoAccountInfo;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  onCopy: (text: string, field: string) => void;
}

export interface CheckoutPageContentProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface CheckoutCustomerSectionProps extends Omit<CheckoutFormStateProps, 'deliveryInfo'> {
  addresses: IAddress[];
}
