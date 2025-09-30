'use client';

import { ICartItem, IProduct } from '@/types';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, deleteCartItem, syncCartFromBackend } from '../httpclient/cart.client';
import { useAuth } from './auth-context';

interface CartContextType {
  items: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ICartItem[]>([]);
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return;

    const init = async () => {
      if (user) {
        const res = await syncCartFromBackend(user.id);
        console.log("get sync", res);
        setItems(res.items);
      } else {
        console.log("non login");
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart);
          } else {
            console.warn("Cart data is not an array, resetting to empty");
            setItems([]);
          }
        }
      }
    };

    init()
    console.log("user 000", user)
  }, [user, isLoading]);

  useEffect(() => {
    // auto save to localStorage if cart changed
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (product: IProduct, quantity: number = 1) => {
    if (user) {
      console.log("login")
      const cartItem = {
        product: product,
        quantity,
        price: product.price,
      } as ICartItem;
      await apiAddToCart(user.id, cartItem)
      const res = await syncCartFromBackend(user.id)
      setItems(res.items)
    } else {
      console.log("no login")
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.product?.id === product.id);

        if (existingItem) {
          return prevItems.map((item) =>
            item.product?.id === product.id
              ? {
                ...item,
                quantity: (item.quantity || 0) + quantity,
                subtotal:
                  ((item.quantity || 0) + quantity) *
                  (item.price || product.price || 0),
              }
              : item
          );
        } else {
          const price = product.price || 0;
          const newId = `${product.id}-${Date.now()}`; // gen id local

          return [
            ...prevItems,
            {
              id: newId,
              product,
              quantity,
              price,
              subtotal: price * quantity,
            },
          ];
        }
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (user) {
      await deleteCartItem(cartItemId)
      const res = await syncCartFromBackend(user.id)
      setItems(res.items)
    } else {
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      )
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (user) {
      // sync lại cart từ BE về local
      await apiUpdateCartItem(cartItemId, quantity)
      const res = await syncCartFromBackend(user.id)
      setItems(res.items)
    } else {
      setItems((prevItems) =>
        prevItems
          .map((item) =>
            item.id === cartItemId
              ? {
                ...item,
                quantity,
                subtotal: quantity * (item.price || 0),
              }
              : item
          )
          .filter((item) => (item.id === cartItemId ? quantity > 0 : true))
      );
    }
  };


  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    const total = items.reduce((total, item) => {
      return total + (item.product?.price! * item.quantity!);
    }, 0);
    return total;
  };

  const getCartItemsCount = () => {
    const count = items.reduce((count, item) => count + item.quantity!, 0);
    return count;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}