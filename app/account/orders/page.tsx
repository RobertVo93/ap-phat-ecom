"use client";

import React from "react";
import {
  OrdersEmptyState,
  OrdersErrorCard,
  OrdersFilterCard,
  OrdersList,
  OrdersPageHeader,
} from "@/components/account/orders";
import { useOrders } from "@/hooks/use-orders";

export default function OrdersPage() {
  const {
    user,
    statusFilter,
    searchQuery,
    orders,
    hasMore,
    loading,
    error,
    loadMoreRef,
    setSearchQuery,
    setStatusFilter,
    t,
  } = useOrders();

  if (!user) return null;

  const hasOrders = orders && orders.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersPageHeader t={t} />
        <OrdersErrorCard error={error} />
        <OrdersFilterCard
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          t={t}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
        />

        {hasOrders ? (
          <div>
            <OrdersList
              hasMore={hasMore}
              loading={loading}
              orders={orders}
              t={t}
              loadMoreRef={loadMoreRef}
            />
          </div>
        ) : (
          <OrdersEmptyState loading={loading} t={t} />
        )}
      </div>
    </div>
  );
}
