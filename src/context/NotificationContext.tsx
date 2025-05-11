import React, { createContext, useContext, useState, ReactNode } from "react";
import { NotificationPayload } from "../typings/types";

interface NotificationContextValue {
  notifications: NotificationPayload[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationPayload[]>>;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  setNotifications: () => {},
});

export function NotificationProvider({
  children,
  initialNotifications,
}: {
  children: ReactNode;
  initialNotifications: NotificationPayload[];
}) {
  const [notifications, setNotifications] =
    useState<NotificationPayload[]>(initialNotifications);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
