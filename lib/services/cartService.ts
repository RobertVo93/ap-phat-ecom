import { AppDataSource } from "@/lib/database/typeorm";
import { CartEntity } from "@/lib/database/entities/cart.entity";
import { CartItemEntity } from "@/lib/database/entities/cart-item.entity";
import { ICartItem } from "@/types";
import { ProductEntity } from "../database/entities";
import { MAX_CART_ITEM_QUANTITY } from "@/constants";
import { getProductPriceByQuantity } from "@/lib/product-pricing";

export async function getCartByUser(userId: string) {
  const cartRepo = AppDataSource.getRepository(CartEntity);
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);
  let cart = await cartRepo.findOne({ where: { userId }, relations: ["items", "items.product"] })

  if (!cart) {
    cart = await cartRepo.save(
      cartRepo.create({
        userId,
        totalPrice: 0,
        totalQuantity: 0,
        items: [],
      })
    );
  }

  if (cart.items?.length) {
    await Promise.all(cart.items.map(async (item) => {
      const quantity = item.quantity || 0;
      const price = getProductPriceByQuantity(item.product || {}, quantity);
      const subtotal = price * quantity;

      if (item.price !== price || item.subtotal !== subtotal) {
        await cartItemRepo.update(item.id!, { price, subtotal });
        item.price = price;
        item.subtotal = subtotal;
      }
    }));
  }

  return cart;
}

export async function addCartItem(userId: string, item: ICartItem) {
  const cartRepo = AppDataSource.getRepository(CartEntity);
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);

  const cart = await cartRepo.findOne({ where: { userId } });
  if (!cart) return null;

  const product = await productRepo.findOne({
    where: { id: item.product?.id },
  });
  if (!product) return null;

  const cartItem = await cartItemRepo.findOne({
    where: {
      cart: { id: cart.id },
      product: { id: product.id },
    },
  });
  const newTotalQuantity = Math.min((cartItem?.quantity || 0) + (item.quantity || 1), MAX_CART_ITEM_QUANTITY);
  const price = getProductPriceByQuantity(product, newTotalQuantity);

  if (cartItem) {
    await cartItemRepo.update(cartItem.id, {
      quantity: newTotalQuantity,
      price,
      subtotal: price * newTotalQuantity,
    });
  } else {
    await cartItemRepo.insert({
      cart: { id: cart.id } as CartEntity,
      product: { id: product.id } as ProductEntity,
      quantity: newTotalQuantity,
      price,
      subtotal: price * newTotalQuantity,
    });
  }
}


export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);

  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId },
    relations: ["product"],
  })
  if (!cartItem) return null;

  if (quantity <= 0) {
    await cartItemRepo.delete(cartItem.id);
  } else {
    cartItem.quantity = Math.min(quantity, MAX_CART_ITEM_QUANTITY);
    cartItem.price = getProductPriceByQuantity(cartItem.product || {}, cartItem.quantity);
    cartItem.subtotal = cartItem.price * cartItem.quantity;
    await cartItemRepo.save(cartItem);
  }
}


export async function deleteCartItem(cartItemId: string) {
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);
  const cartItem = await cartItemRepo.findOne({
    where: { id: cartItemId },
    relations: ["cart", "cart.items"],
  });
  if (!cartItem) return null;
  await cartItemRepo.remove(cartItem);
}

export async function clearCart(userId: string) {
  const cartRepo = AppDataSource.getRepository(CartEntity)
  const itemRepo = AppDataSource.getRepository(CartItemEntity)

  const cart = await cartRepo.findOne({ where: { userId } })
  if (!cart) return null

  await itemRepo.delete({ cart: { id: cart.id } })

  cart.totalQuantity = 0
  cart.totalPrice = 0
  await cartRepo.save(cart)

  return cart
}
