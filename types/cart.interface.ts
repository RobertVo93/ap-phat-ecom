import { IBase, ICartItem } from "@/types";

export interface ICart extends IBase {
    userId?: string
    totalQuantity?: number
    totalPrice?: number
    items?: ICartItem[]
}
