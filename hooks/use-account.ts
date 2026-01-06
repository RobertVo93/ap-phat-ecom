"use client"

import { useAuth } from "@/lib/contexts/auth-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { apiGetUserStats } from "@/lib/httpclient/user.client";
import { IOrder, IRecentOrder } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAccount = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false)
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalAddresses: 0
  })
  const [recentOrders, setRecentOrders] = useState<IRecentOrder[]>([])

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserStats = async () => {
    try {
      setLoading(true)
      const res = await apiGetUserStats(user?.id!)
      const formatedOrders = (res.recentOrders as IOrder[]).map((order) => ({
        id: order.id,
        number: order.number,
        date: order.deliveryDate,
        total: order.totalAmount,
        status: order.status,
        items: order.items?.length
      })) ?? []
      setRecentOrders(formatedOrders as IRecentOrder[])

      setUserStats(res.stats)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      getUserStats()
    }
  }, [user])

  return {
    loading,
    user,
    userStats,
    recentOrders,

    t,
    handleLogout,
  }
} 