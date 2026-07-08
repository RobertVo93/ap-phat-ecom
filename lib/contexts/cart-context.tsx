'use client';

import { ICartItem, IProduct } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  deleteCartItem,
  getUserCart
} from '../httpclient/cart.client';
import { useAuth } from './auth-context';
import { clearCart as apiClearCart } from "@/lib/httpclient/cart.client"
import { getProductPriceByQuantity } from '@/lib/product-pricing';

interface CartContextType {
  items: ICartItem[];
  addToCart: (product: IProduct, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [items, setItems] = useState<ICartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const priceCartItem = (item: ICartItem, quantity = item.quantity || 0): ICartItem => {
    const price = getProductPriceByQuantity(item.product || {}, quantity);

    return {
      ...item,
      quantity,
      price,
      subtotal: price * quantity,
    };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // load cart when mount
  useEffect(() => {
    if (!mounted || isLoading) return;

    const init = async () => {
      if (user) {
        // sync from backend
        const res = await getUserCart();
        if (res.items) {
          setItems(res.items);
        }
      } else {
        // load from localStorage if didn't login
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);
              if (Array.isArray(parsed)) setItems(parsed.map((item) => priceCartItem(item)));
            } catch (err) {
              console.warn('Failed to parse cart from localStorage', err);
            }
          }
        }
      }
    };

    init();
  }, [mounted, user, isLoading]);

  useEffect(() => {
    if (!user && mounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user, mounted]);

  const addToCart = async (product: IProduct, quantity: number = 1) => {
    if (user) {
      const price = getProductPriceByQuantity(product, quantity);
      const cartItem: ICartItem = {
        product,
        quantity,
        price,
        subtotal: price * quantity,
      };
      await apiAddToCart(cartItem);
      const res = await getUserCart();
      setItems(res.items);
    } else {
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.product?.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.product?.id === product.id
              ? (() => {
                const newQuantity = (item.quantity || 0) + quantity;
                return priceCartItem({ ...item, product }, newQuantity);
              })()
              : item
          );
        } else {
          const price = getProductPriceByQuantity(product, quantity);
          const newId = `local-${product.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          return [
            ...prevItems,
            { id: newId, product, quantity, price, subtotal: price * quantity },
          ];
        }
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (user) {
      await deleteCartItem(cartItemId);
      const res = await getUserCart();
      setItems(res.items);
    } else {
      setItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (user) {
      await apiUpdateCartItem(cartItemId, quantity);
      const res = await getUserCart();
      setItems(res.items);
    } else {
      setItems(prevItems =>
        prevItems
          .map(item =>
            item.id === cartItemId
              ? (() => {
                return priceCartItem(item, quantity)
              })()
              : item
          )
          .filter(item => (item.id === cartItemId ? quantity > 0 : true))
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      const res = await apiClearCart()
      if (res) {
        setItems([]);
        if (!user && typeof window !== 'undefined') localStorage.removeItem('cart');
      }
    } else {
      setItems([]);
      if (!user && typeof window !== 'undefined') localStorage.removeItem('cart');
    }
  };

  const getCartTotal = () =>
    items.reduce((total, item) => total + (item.subtotal ?? (item.price || 0) * (item.quantity || 0)), 0);

  const getCartItemsCount = () =>
    items.reduce((count, item) => count + (item.quantity || 0), 0);

  if (!mounted) return null; // to avoid SSR mismatch

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
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
