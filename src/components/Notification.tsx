import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { NotificationPayload } from "../typings/types";
import { Link } from "react-router";

export default function NotificationComponent(props: {
  notifications: NotificationPayload[];
}) {
  const [notifications, setNotifications] = useState(() => props.notifications);;
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  useEffect(() => {
    setNotifications(props.notifications);
  }, [props.notifications]);


  return (
    <div ref={menuRef} className="relative">
      <Link
        to={"notification"}
        className="relative block p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={`${unreadCount} notificări necitite`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}
