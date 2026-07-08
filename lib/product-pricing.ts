import type { IProduct, ProductTierPrice } from "@/types";

type PricingProduct = Partial<Pick<IProduct, "price" | "tierPrices">> & {
  unitCost?: number;
};

export function getProductPriceByQuantity(
  product: PricingProduct,
  quantity: number,
) {
  const tiers = getOrderedTierPrices(product.tierPrices);
  const matchingTier = tiers.find((tier) => {
    const withinMin = quantity >= tier.minQuantity;
    const withinMax = tier.maxQuantity === undefined || quantity <= tier.maxQuantity;
    return withinMin && withinMax;
  });

  return matchingTier?.price ?? product.price ?? product.unitCost ?? 0;
}

export function getOrderedTierPrices(tierPrices?: ProductTierPrice[]) {
  return (tierPrices || [])
    .filter((tier) => tier.minQuantity > 0 && tier.price >= 0)
    .filter((tier) => {
      const order = (tier as Partial<ProductTierPrice>).order;
      return order === undefined || order > 0;
    })
    .sort((a, b) => {
      const aOrder = (a as Partial<ProductTierPrice>).order;
      const bOrder = (b as Partial<ProductTierPrice>).order;

      if (aOrder !== undefined && bOrder !== undefined && aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.minQuantity - b.minQuantity;
    });
}

export function getSortedTierPrices(tierPrices?: ProductTierPrice[]) {
  return getOrderedTierPrices(tierPrices);
}
