import { useState, useEffect } from "react";
import { Notification } from "@/lib/types/notification";
import axios from "@/lib/utils/axios";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/notifications");
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch notifications")
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      return true;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return false;
    }
  };

  const deleteNotifications = async (notificationIds: string[]) => {
    try {
      await axios.delete("/notifications", {
        data: { notificationIds: notificationIds },
      });
      setNotifications(notifications.filter(n => !notificationIds.includes(n._id)));
      setSelectedNotifications([]);
      return true;
    } catch (error) {
      console.error("Failed to delete notifications:", error);
      return false;
    }
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    refreshNotifications: fetchNotifications,
    deleteNotifications,
    selectedNotifications,
    toggleNotificationSelection
  };
}
