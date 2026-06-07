'use client';

import { LoadingOverlay } from '@/components/common/LoadOverlay';
import { bankInfo, momoInfo } from '@/components/checkout/checkout-constants';
import { CheckoutEmptyState } from '@/components/checkout/checkout-empty-state';
import { CheckoutHeader } from '@/components/checkout/checkout-header';
import { CustomerInfoSection } from '@/components/checkout/customer-info-section';
import { DeliveryInfoSection } from '@/components/checkout/delivery-info-section';
import { CheckoutOrderSummary } from '@/components/checkout/order-summary';
import { PaymentInfoSection } from '@/components/checkout/payment-info';
import { useCart } from '@/lib/contexts/cart-context';
import { useCheckout } from '@/hooks/use-checkout';

export function CheckoutPageContent() {
  const {
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
  } = useCheckout();
  const { items } = useCart();

  if (items.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <form onSubmit={handlePlaceOrder}>
      <LoadingOverlay loading={loading} />

      <div className="min-h-screen bg-[#f8f5f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CheckoutHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CustomerInfoSection
                addresses={addresses}
                orderData={orderData}
                setOrderData={setOrderData}
                setDeliveryInfo={setDeliveryInfo}
              />
              <DeliveryInfoSection
                orderData={orderData}
                deliveryInfo={deliveryInfo}
                setOrderData={setOrderData}
                setDeliveryInfo={setDeliveryInfo}
              />
              <PaymentInfoSection
                paymentMethod={orderData.paymentMethod}
                copiedField={copiedField}
                total={total}
                bankInfo={bankInfo}
                momoInfo={momoInfo}
                onPaymentMethodChange={onSetPaymentMethod}
                onCopy={copyToClipboard}
              />
            </div>

            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              agreeTerms={agreeTerms}
              voucherCode={voucherCode}
              voucherError={voucherError}
              appliedVoucher={appliedVoucher}
              pointsToRedeem={pointsToRedeem}
              discountCalculation={discountCalculation}
              loyaltyPoints={loyaltyPoints}
              onVoucherCodeChange={setVoucherCode}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
              onPointsChange={handlePointsChange}
              onAgreeTermsChange={setAgreeTerms}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
