"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import { useNotification } from "@/lib/contexts/notification-context";
import { apiGetAllNotifications, apiMarkAllAsRead, apiMarkAsRead } from "@/lib/httpclient/notification.client";
import { INotification } from "@/types";
import { useCallback, useEffect, useState } from "react";

const INITIAL_LIMIT = 10;
const LOAD_MORE_LIMIT = 5;

export const useNotificationPage = () => {
  const { user } = useAuth();
  const {
    syncNotifications,
    setUnreadNumber
  } = useNotification();

  const [observerTarget, setObserverTarget] = useState<HTMLElement | null>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const onMarkAsRead = async (id: string) => {
    try {
      setLoading(true)
      const res = await apiMarkAsRead(id)
      if (res) {
        setNotifications(prev => prev.map(noti => noti.id === id ? res : noti));
        setUnreadNumber(prev => prev - 1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onMarkAllAsRead = async () => {
    try {
      setLoading(true)
      const res = await apiMarkAllAsRead(user?.id!)
      if (res) {
        setNotifications(prev => prev.map(noti => noti.isRead ? noti : {...noti, isRead: true}));
        setUnreadNumber(0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = useCallback(
    async (isLoadMore = false) => {
      if (!user) return;
      if (loading) return;
      if (isLoadMore && !hasMore) return;

      setLoading(true);

      try {
        const limit = isLoadMore ? LOAD_MORE_LIMIT : INITIAL_LIMIT;
        const currentOffset = isLoadMore ? offset : 0;

        const response = await apiGetAllNotifications({
          userId: user.id,
          limit,
          offset: currentOffset,
        });

        const data = response.data;

        setNotifications((prev) =>
          isLoadMore ? [...prev, ...data] : data
        );

        setOffset(currentOffset + data.length);
        setHasMore(response.hasMore ?? data.length === limit);
      } catch (err) {
        console.error("Error loading notification page:", err);
      } finally {
        setLoading(false);
      }
    },
    [user, offset, loading, hasMore]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchNotifications(false);
  }, [user]);

  const fetchLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNotifications(true);
    }
  }, [loading, hasMore, fetchNotifications]);

  useEffect(() => {
    if (!observerTarget || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(observerTarget);

    return () => observer.disconnect();
  }, [observerTarget, hasMore, loading, fetchLoadMore]);

  useEffect(() => {
    syncNotifications(notifications)
  }, [notifications])

  return {
    notifications,
    loading,
    hasMore,
    loadMoreRef: setObserverTarget,
    onMarkAsRead,
    onMarkAllAsRead,
  };
};