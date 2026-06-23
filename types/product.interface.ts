import { ProductSortBy, ProductStatus, ProductUnit } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { ICollection } from "./collection.interface";

export interface ProductTierPrice {
  minQuantity: number
  maxQuantity?: number
  price: number
  order: number
}

export interface IProduct extends IBase {
  name?: string
  unit?: ProductUnit
  description?: string
  price?: number
  tierPrices?: ProductTierPrice[]
  cost?: number
  stock?: number
  minStock?: number
  sku?: string
  barcode?: string
  status?: ProductStatus
  supplier?: string
  image?: string
  subImages?: string[]

  collections?: ICollection[]
}

export interface IProductFilters extends IBaseFilters {
  collectionId?: string
  sortBy?: ProductSortBy
  status?: string
  search?: string
  priceRange?: {
    min: number
    max: number
  }
  stockRange?: {
    min: number
    max: number
  }
}
