import { AppDataSource } from "@/lib/database/typeorm";
import { CartEntity } from "@/lib/database/entities/cart.entity";
import { CartItemEntity } from "@/lib/database/entities/cart-item.entity";
import { ICartItem } from "@/types";
import { ProductEntity } from "../database/entities";

export async function syncCartFromBE(userId: string) {
  const cartRepo = AppDataSource.getRepository(CartEntity);
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);
  let cart = await cartRepo.findOne({ where: { userId }, relations: ["items", "items.product"] })

  if (!cart) {
    cart = cartRepo.create({
      userId: userId,
      totalPrice: 0,
      totalQuantity: 0,
      items: [],
    })
  }

  //sort
  const items = await cartItemRepo.find({
    where: { cart: { id: cart.id } },
    relations: ["product"],
    order: { createdAt: "ASC" },
  });

  cart.items = items;

  return cartRepo.save(cart);
}

export async function addCartItem(userId: string, item: ICartItem) {
  const cartRepo = AppDataSource.getRepository(CartEntity);
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);

  const cart = await cartRepo.findOne({
    where: { userId },
    relations: ["items", "items.product"],
  });
  if (!cart) return null;

  const product = await productRepo.findOne({
    where: { id: item.product?.id },
  });
  if (!product) return null;

  let cartItem = cart.items?.find((i) => i.product?.id === product.id);

  if (cartItem) {
    cartItem.quantity = (cartItem.quantity || 0) + 1;
    cartItem.subtotal = (cartItem.price! || product.price!) * cartItem.quantity;
    await cartItemRepo.save(cartItem);
  } else {
    cartItem = cartItemRepo.create({
      cart,
      product,
      quantity: item.quantity || 1,
      price: product.price,
      subtotal: product.price! * (item.quantity || 1),
    });
    await cartItemRepo.save(cartItem);
  }
}


export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  const cartItemRepo = AppDataSource.getRepository(CartItemEntity);

  const cartItem = await cartItemRepo.findOne({ where: { id: cartItemId } })
  if (!cartItem) return null;

  if (quantity <= 0) {
    await cartItemRepo.remove(cartItem);
  } else {
    cartItem.quantity = quantity;
    cartItem.subtotal = (cartItem.price || 0) * quantity;
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
