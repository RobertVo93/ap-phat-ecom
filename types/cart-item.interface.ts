import { IBase, ICart, IProduct } from "@/types";

export interface ICartItem extends IBase {
    quantity?: number
    price?: number
    subtotal?: number
    cart?: ICart
    product?: IProduct
}