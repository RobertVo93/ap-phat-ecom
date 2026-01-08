"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import { useLanguage } from "@/lib/contexts/language-context";
import { apiGetOrders } from "@/lib/httpclient/order.client";
import { useDebounceSearchTerm } from "@/lib/utils.client";
import { IOrder } from "@/types";
import { useEffect, useMemo, useState, useCallback } from "react";

const INITIAL_LIMIT = 10;
const LOAD_MORE_LIMIT = 5;

export const useOrders = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [observerTarget, setObserverTarget] = useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounceSearchTerm(searchQuery, 500);

  const apiParams = useMemo(() => {
    return {
      customerId: user?.id,
      searchTerm: debouncedSearchTerm,
      status: statusFilter === "all" ? undefined : statusFilter,
    };
  }, [user?.id, debouncedSearchTerm, statusFilter]);

  const fetchOrders = useCallback(
    async (isLoadMore = false) => {
      if (loading) return;
      if (isLoadMore && !hasMore) return;
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const limit = isLoadMore ? LOAD_MORE_LIMIT : INITIAL_LIMIT;
        const currentOffset = isLoadMore ? offset : 0;

        const data = await apiGetOrders({
          ...apiParams,
          limit,
          offset: currentOffset,
        });

        setOrders((prev) =>
          isLoadMore ? [...prev, ...data] : data
        );

        setOffset(currentOffset + data.length);
        setHasMore(data.length === limit);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to fetch orders";
        setError(errorMessage);
        console.error("Error fetching orders:", e);
      } finally {
        setLoading(false);
      }
    },
    [apiParams, offset, loading, hasMore]
  );

  // Separate effect for fetching orders when params change
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setError(null);
    fetchOrders(false);
  }, [apiParams]);

  // Stable ref for the fetch function to use in IntersectionObserver
  const fetchLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchOrders(true);
    }
  }, [loading, hasMore]);

  // IntersectionObserver effect
  useEffect(() => {
    if (!hasMore || !observerTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget);

    return () => observer.disconnect();
  }, [hasMore, loading, observerTarget, fetchLoadMore]);

  return {
    user,
    statusFilter,
    searchQuery,
    orders,
    hasMore,
    loading,
    error,
    loadMoreRef: setObserverTarget,
    setSearchQuery,
    setStatusFilter,
    t,
  };
};