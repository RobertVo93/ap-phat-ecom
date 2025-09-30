import { CollectionStatus } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { IProduct } from "@/types/product.interface";

export interface ICollection extends IBase {
  number?: string
  name?: string
  description?: string
  status?: CollectionStatus
  image?: string

  products?: IProduct[]
}

export interface ICollectionFilters extends IBaseFilters {
  name?: string;
  status?: string;
  search?: string;
}
