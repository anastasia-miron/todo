import { MessageSquare } from "lucide-react";
import { Link } from "react-router";

interface MessageNotificationButtonProps {
  unreadCount: number;
}

export default function MessageNotificationButton({
  unreadCount,
}: MessageNotificationButtonProps) {
  return (
    <Link
      to={"/app/messages"}
      className="relative p-2 cursor-pointer rounded-full transition-colors flex items-center gap-2"
      aria-label={`${unreadCount} unread messages`}
    >
      <MessageSquare className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
