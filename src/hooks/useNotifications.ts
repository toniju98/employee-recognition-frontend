import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/lib/types/notification";
import axios from "@/lib/utils/axios";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const fetchNotifications = useCallback(async (): Promise<void> => {
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
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      return true;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return false;
    }
  }, []);

  const deleteNotifications = useCallback(async (notificationIds: string[]): Promise<boolean> => {
    try {
      await axios.delete("/notifications", {
        data: { notificationIds: notificationIds },
      });
      setNotifications(prev => prev.filter(n => !notificationIds.includes(n._id)));
      setSelectedNotifications([]);
      return true;
    } catch (error) {
      console.error("Failed to delete notifications:", error);
      return false;
    }
  }, []);

  const toggleNotificationSelection = useCallback((notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
