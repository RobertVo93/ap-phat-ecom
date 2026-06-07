import { Minus, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscountCalculation } from '@/components/checkout/checkout-types';
import { useLanguage } from '@/lib/contexts/language-context';
import { formatCurrency } from '@/lib/utils';

interface LoyaltyPointsSectionProps {
  loyaltyPoints: number;
  pointsToRedeem: number;
  subtotal: number;
  discountCalculation: DiscountCalculation;
  onPointsChange: (change: number) => void;
}

export function LoyaltyPointsSection({
  loyaltyPoints,
  pointsToRedeem,
  subtotal,
  discountCalculation,
  onPointsChange,
}: LoyaltyPointsSectionProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="hidden space-y-3">
        <h4 className="font-semibold text-[#573e1c] flex items-center">
          <Star className="w-4 h-4 mr-2" />
          {t('checkout.points.title')}
        </h4>

        <div className="text-sm text-[#8b6a42]">
          {t('checkout.points.available')}: {loyaltyPoints.toLocaleString()} {t('checkout.points.unit')}
        </div>

        {loyaltyPoints > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onPointsChange(-100)}
                disabled={pointsToRedeem <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <div className="flex-1 text-center">
                <span className="font-medium">{pointsToRedeem.toLocaleString()}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onPointsChange(100)}
                disabled={pointsToRedeem >= loyaltyPoints}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {pointsToRedeem > 0 && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                {t('checkout.points.discount')}: -{formatCurrency(discountCalculation.pointsDiscount)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hidden p-3 bg-[#efe1c1] rounded-lg">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-[#573e1c]" />
          <span className="text-sm text-[#573e1c]">
            {t('checkout.points.earn')}: +{Math.floor(subtotal * 0.05).toLocaleString()} {t('checkout.points.unit')}
          </span>
        </div>
      </div>
    </>
  );
}
