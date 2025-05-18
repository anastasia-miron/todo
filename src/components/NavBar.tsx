import { useLocation, useNavigate, Link } from "react-router";
import Avatar from "./Avatar";
import Logo from "./Logo";
import "./NavBar.css";
import { ChevronLeft } from "lucide-react";
import useCurrentUser from "../hooks/useCurrentUser";
import { useCallback, useEffect, useRef } from "react";
import {
  MessageRecievedPayload,
  NotificationPayload,
} from "../typings/types";
import NotificationComponent from "./Notification";
import useAbortSignal from "../hooks/useAbortSignal";
import apiService from "../services/api.service";
import { useNotifications } from "../context/NotificationContext";
import MessageNotificationButton from "./ui/MessageNotificationButton";
import { useMessages } from "../context/MessageContext";
import { useEventSource } from "../hooks/useEvenetSource";

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const { user, logout } = useCurrentUser();
  const signal = useAbortSignal();
  const { notifications, setNotifications } = useNotifications();
  const { messages, setMessages } = useMessages();

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  useEffect(() => {
    // Request to API
    (async () => {
      const response = await apiService.get<NotificationPayload[]>(
        `/notifications`,
        {
          signal,
        }
      );
      if (signal.aborted) return;

      if (response.success) {
        setNotifications(response.data);
      }
    })();

    const getRequestMessagesByUserId = async () => {
      const response = await apiService.get<MessageRecievedPayload[]>(
        `/requests/messages`
      );

      if (response.success) {
        setMessages(response.data);
      }
    };

    getRequestMessagesByUserId();
  }, []);

  console.log("notifications", notifications);

  // Create an use Callback which will be executed and return unreadCount for All the messages
  const getUnreadCountTotal = useCallback(
    () => messages.reduce((sum, m) => sum + m.unreadCount, 0),
    [messages]
  );

  // inside your component
  useEventSource("/sse/notifications", `notification:${user?.type}`, (ev) => {
    try {
      const payload = JSON.parse(ev.data);
      console.log(payload);
      setNotifications((prev) => {
        const newArray = [payload, ...prev];
        return newArray;
      });
    } catch (e) {
      console.error(e);
    }
  });

  useEventSource("/sse/recieve_message", "subscribe_message", (ev) => {
    try {
      const payload = JSON.parse(ev.data) as MessageRecievedPayload;

      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === payload.id);
        if (idx > -1) {
          return prev.map((m, i) =>
            i === idx
              ? {
                  ...m,
                  lastMessage: {
                    ...m.lastMessage,
                    content: payload.lastMessage.content,
                    timestamp: payload.lastMessage.timestamp,
                    isSystem: payload.lastMessage.isSystem,
                    sender: payload.lastMessage.sender ?? null,
                  },
                  unreadCount: m.unreadCount + 1,
                }
              : m
          );
        }

        return [payload, ...prev];
      });
    } catch (e) {
      console.error(e);
    }
  });

  const handleClose = () => {
    if (!menuRef.current) return;
    menuRef.current.open = false;
  };

  return (
    <div className="navbar">
      {location.pathname !== "/app/" ? (
        <ChevronLeft onClick={() => navigate(-1)} />
      ) : (
        <div className="navbar__placeholder" />
      )}
      <Logo
        onClick={() => {
          navigate("/app/");
        }}
        className="navbar__logo"
      />
      <NotificationComponent notifications={notifications} />
      <MessageNotificationButton unreadCount={getUnreadCountTotal()} />
      {user && (
        <details ref={menuRef} className="dropdown navbar__menu">
          <summary role="menu">
            <Avatar user={user} className="navbar__avatar ml-1" />
          </summary>
          <ul dir="rtl">
            <li>
              <Link to="/app/profile" onClick={handleClose}>
                Profil
              </Link>
            </li>
            <li>
              <Link to="/app/settings" onClick={handleClose}>
                Setări
              </Link>
            </li>
            <li>
              <Link to="/app/history" onClick={handleClose}>
                Istoric 
              </Link>
            </li>
            <li>
              <Link to="/app/reviews" onClick={handleClose}>
                Recenzii
              </Link>
            </li>
            <li>
              <a onClick={handleLogout}>Delogare</a>
            </li>
          </ul>
        </details>
      )}
    </div>
  );
};

export default NavBar;
