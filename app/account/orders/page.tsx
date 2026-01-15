"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Eye,
  Search,
  Filter,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/lib/utils.currency";
import { getOrderStatusColor } from "@/lib/utils.style";
import { OrderStatus } from "@/types";

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

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-[#573e1c] hover:bg-[#efe1c1]"
          >
            <Link href="/account">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("account.backToAccount")}
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-[#573e1c] mt-4">
            {t("account.manageOrders")}
          </h1>
          <p className="text-[#8b6a42] mt-2">
            {t("account.trackAndManage")}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="p-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {(orders && orders.length > 0) ? (
          <div>
            <Card className="bg-white border-[#d4c5a0] mb-6">
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6a42]" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("account.searchPlaceholder")}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#8b6a42]" />
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("account.allStatus")}
                      </SelectItem>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`account.status.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="bg-white border-[#d4c5a0]">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center text-[#573e1c]">
                          <Package className="w-5 h-5 mr-2" />
                          {t("account.orderNumber").replace(
                            "{id}",
                            order.number || "N/A"
                          )}
                        </CardTitle>
                        <p className="text-sm text-[#8b6a42]">
                          {order.deliveryDate
                            ? new Date(order.deliveryDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <Badge
                        className={getOrderStatusColor(order.status || "pending")}
                      >
                        {t(`account.status.${order.status}`)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {order.items && order.items.length > 0
                      ? order.items.map((item, i) => (
                          <div
                            key={item.id || i}
                            className="flex justify-between py-2 border-b last:border-b-0"
                          >
                            <span>
                              {item.product?.name || "Unknown item"} x{item.quantity || 0}
                            </span>
                            <span>
                              {formatCurrency(item.totalCost || 0)}
                            </span>
                          </div>
                        ))
                      : null}

                    {order.notes && (
                      <div className="flex justify-between py-2 border-b last:border-b-0">
                        <span className="font-semibold">
                          {t("account.orderNote")}:
                        </span>
                        <span>{order.notes}</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <span className="font-semibold">
                        {t("account.total").replace(
                          "{amount}",
                          formatCurrency(order.totalAmount || 0)
                        )}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                      >
                        <Link href={`/account/orders/${order.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          {t("account.orderDetails")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-6 text-[#8b6a42] min-h-[50px]"
                >
                  {loading && <Loader2 className="h-8 w-8 animate-spin" />}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <div className="flex flex-col items-center">
                <ClipboardList className="w-24 h-24 text-[#8b6a42] mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
                  {t("account.noOrdersFound")}
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}