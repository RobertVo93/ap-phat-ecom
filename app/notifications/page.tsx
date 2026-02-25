"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Eye,
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
import { useNotificationPage } from "@/hooks/use-notification-page";
import { useLanguage } from "@/lib/contexts/language-context";
import { formatCurrency } from "@/lib/utils.currency";
import { formatDateTime } from "@/lib/utils.date";
import { useRouter } from "next/navigation";

export default function NotificationPage() {
  const {
    notifications,
    loading,
    hasMore,
    loadMoreRef,
    onMarkAsRead,
    onMarkAllAsRead,
  } = useNotificationPage();

  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          <div className="flex justify-between items-start mt-4">
            <div>
              <h1 className="text-3xl font-bold text-[#573e1c]">
                {t("noti.notifications")}
              </h1>
              <p className="text-[#8b6a42] mt-2">
                {t("noti.trackNotifications")}
              </p>
            </div>

            {notifications.length > 0 && (
              <Button
                variant="outline"
                onClick={onMarkAllAsRead}
              >
                {t("noti.markAllRead")}
              </Button>
            )}
          </div>
        </div>

        {/* Body */}
        {notifications.length > 0 ? (
          <div className="space-y-6">
            {notifications.map((noti) => (
              <Card
                key={noti.id}
                className={`border-[#d4c5a0] ${
                  noti.isRead ? "bg-white" : "bg-[#E6F2FF]"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle className="flex items-center text-[#573e1c]">
                      <Bell className="w-5 h-5 mr-2" />
                      {t(`noti.order.${noti.title}`)}
                    </CardTitle>

                    {!noti.isRead && (
                      <Badge className="bg-blue-500 text-white">
                        {t("noti.unread")}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-[#8b6a42] mt-1">
                    {formatDateTime(noti.createdAt!)}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p>
                    {t(`noti.order.${noti.content}`).replace(
                      "{orderNumber}",
                      noti.data?.orderNumber
                    )}
                  </p>

                  <p>
                    {t("noti.total")}:{" "}
                    {formatCurrency(noti.data?.total)}
                  </p>

                  <div className="flex justify-end gap-2 pt-2">
                    {!noti.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkAsRead(noti.id!)}
                      >
                        {t("noti.markAsRead")}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (!noti.isRead) {
                          onMarkAsRead(noti.id!);
                        }
                        router.push(noti.url || "");
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {t("noti.viewDetail")}
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
                {loading && (
                  <Loader2 className="h-8 w-8 animate-spin" />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <div className="flex flex-col items-center">
                <ClipboardList className="w-24 h-24 text-[#8b6a42] mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-[#573e1c] mb-4">
                  {t("noti.noNotifications")}
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}