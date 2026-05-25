import { create } from "zustand";
import type { AppNotification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/lib/data/analytics";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  addNotification: (data) => {
    const n: AppNotification = {
      ...data,
      id: `n-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    set((s) => ({ notifications: [n, ...s.notifications] }));
  },
}));
