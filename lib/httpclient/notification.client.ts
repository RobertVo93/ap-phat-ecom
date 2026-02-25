import { INotificationFilter, INotificationSettings } from "@/types"
import { appendQueryParams } from "./base";

export const apiGetAllNotifications = async (params: INotificationFilter) => {
  const url = appendQueryParams("/api/notifications", params);
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
};

export const apiGetUnreadCount = async (userId: string) => {
  const res = await fetch(`/api/notifications/unread/?userId=${userId}`);
  return res.json();
}

export const apiMarkAsRead = async (id: string) => {
  const res = await fetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error("Failed to mark notification as read")
  return res.json()
}

export const apiMarkAllAsRead = async (userId: string) => {
  const res = await fetch(`/api/notifications/mark-all?userId=${userId}`, {
    method: 'PATCH',
  });

  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return res.json();
}

// Notification settings
export const apiGetNotificationSettings = async (userId: string) => {
  const res = await fetch(`/api/notifications/settings/?userId=${userId}`);
  return res.json();
}

export const apiUpdateNotificationSettings = async (id: string, data: INotificationSettings) => {
  const res = await fetch(`/api/notifications/settings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
}