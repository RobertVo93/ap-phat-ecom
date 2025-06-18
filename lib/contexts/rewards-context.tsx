'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';

export interface Voucher {
  id: string;
  code: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  isUsed: boolean;
  isActive: boolean;
}

export interface PointTransaction {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  description: string;
  descriptionEn: string;
  date: string;
  orderId?: string;
}

interface RewardsContextType {
  loyaltyPoints: number;
  vouchers: Voucher[];
  pointTransactions: PointTransaction[];
  addPoints: (amount: number, orderId: string) => void;
  redeemPoints: (amount: number, description: string) => void;
  addVoucher: (voucher: Voucher) => void;
  useVoucher: (voucherId: string) => void;
  calculateDiscount: (subtotal: number, voucherCode?: string, pointsToRedeem?: number) => {
    voucherDiscount: number;
    pointsDiscount: number;
    totalDiscount: number;
    finalAmount: number;
  };
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

// Mock vouchers data
const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME10',
    title: 'Chào mừng khách hàng mới',
    titleEn: 'Welcome New Customer',
    description: 'Giảm 10% cho đơn hàng đầu tiên',
    descriptionEn: '10% off for first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50000,
    maxDiscountAmount: 20000,
    expiryDate: '2024-12-31',
    isUsed: false,
    isActive: true
  },
  {
    id: '2',
    code: 'FREESHIP',
    title: 'Miễn phí vận chuyển',
    titleEn: 'Free Shipping',
    description: 'Miễn phí vận chuyển cho đơn hàng từ 100k',
    descriptionEn: 'Free shipping for orders over 100k',
    discountType: 'fixed',
    discountValue: 25000,
    minOrderAmount: 100000,
    expiryDate: '2024-06-30',
    isUsed: false,
    isActive: true
  },
  {
    id: '3',
    code: 'SAVE50K',
    title: 'Giảm 50k',
    titleEn: 'Save 50k',
    description: 'Giảm 50k cho đơn hàng từ 200k',
    descriptionEn: '50k off for orders over 200k',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderAmount: 200000,
    expiryDate: '2024-08-15',
    isUsed: true,
    isActive: true
  }
];

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([]);

  useEffect(() => {
    if (user) {
      // Load user's rewards data from localStorage
      const savedPoints = localStorage.getItem(`loyaltyPoints_${user.id}`);
      const savedVouchers = localStorage.getItem(`vouchers_${user.id}`);
      const savedTransactions = localStorage.getItem(`pointTransactions_${user.id}`);

      if (savedPoints) {
        setLoyaltyPoints(parseInt(savedPoints));
      }
      if (savedVouchers) {
        try {
          setVouchers(JSON.parse(savedVouchers));
        } catch (error) {
          console.error('Error loading vouchers:', error);
        }
      }
      if (savedTransactions) {
        try {
          setPointTransactions(JSON.parse(savedTransactions));
        } catch (error) {
          console.error('Error loading transactions:', error);
        }
      }
    }
  }, [user]);

  const saveToStorage = (key: string, data: any) => {
    if (user) {
      localStorage.setItem(`${key}_${user.id}`, JSON.stringify(data));
    }
  };

  const addPoints = (amount: number, orderId: string) => {
    const pointsToAdd = Math.floor(amount * 0.05); // 5% of order total
    const newPoints = loyaltyPoints + pointsToAdd;
    setLoyaltyPoints(newPoints);
    localStorage.setItem(`loyaltyPoints_${user?.id}`, newPoints.toString());

    const transaction: PointTransaction = {
      id: Date.now().toString(),
      type: 'earned',
      amount: pointsToAdd,
      description: `Tích điểm từ đơn hàng #${orderId}`,
      descriptionEn: `Points earned from order #${orderId}`,
      date: new Date().toISOString(),
      orderId
    };

    const newTransactions = [transaction, ...pointTransactions];
    setPointTransactions(newTransactions);
    saveToStorage('pointTransactions', newTransactions);
  };

  const redeemPoints = (amount: number, description: string) => {
    if (amount > loyaltyPoints) return;

    const newPoints = loyaltyPoints - amount;
    setLoyaltyPoints(newPoints);
    localStorage.setItem(`loyaltyPoints_${user?.id}`, newPoints.toString());

    const transaction: PointTransaction = {
      id: Date.now().toString(),
      type: 'redeemed',
      amount: amount,
      description: description,
      descriptionEn: description,
      date: new Date().toISOString()
    };

    const newTransactions = [transaction, ...pointTransactions];
    setPointTransactions(newTransactions);
    saveToStorage('pointTransactions', newTransactions);
  };

  const addVoucher = (voucher: Voucher) => {
    const newVouchers = [...vouchers, voucher];
    setVouchers(newVouchers);
    saveToStorage('vouchers', newVouchers);
  };

  const useVoucher = (voucherId: string) => {
    const newVouchers = vouchers.map(v => 
      v.id === voucherId ? { ...v, isUsed: true } : v
    );
    setVouchers(newVouchers);
    saveToStorage('vouchers', newVouchers);
  };

  const calculateDiscount = (
    subtotal: number, 
    voucherCode?: string, 
    pointsToRedeem?: number
  ) => {
    let voucherDiscount = 0;
    let pointsDiscount = 0;
    let amountAfterVoucher = subtotal;

    // Apply voucher first
    if (voucherCode) {
      const voucher = vouchers.find(v => 
        v.code === voucherCode && 
        !v.isUsed && 
        v.isActive && 
        subtotal >= v.minOrderAmount &&
        new Date(v.expiryDate) > new Date()
      );

      if (voucher) {
        if (voucher.discountType === 'percentage') {
          voucherDiscount = (subtotal * voucher.discountValue) / 100;
          if (voucher.maxDiscountAmount) {
            voucherDiscount = Math.min(voucherDiscount, voucher.maxDiscountAmount);
          }
        } else {
          voucherDiscount = voucher.discountValue;
        }
        amountAfterVoucher = subtotal - voucherDiscount;
      }
    }

    // Apply points discount to remaining amount
    if (pointsToRedeem && pointsToRedeem <= loyaltyPoints) {
      pointsDiscount = Math.min(pointsToRedeem, amountAfterVoucher);
    }

    const totalDiscount = voucherDiscount + pointsDiscount;
    const finalAmount = Math.max(0, subtotal - totalDiscount);

    return {
      voucherDiscount,
      pointsDiscount,
      totalDiscount,
      finalAmount
    };
  };

  return (
    <RewardsContext.Provider value={{
      loyaltyPoints,
      vouchers,
      pointTransactions,
      addPoints,
      redeemPoints,
      addVoucher,
      useVoucher,
      calculateDiscount
    }}>
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}