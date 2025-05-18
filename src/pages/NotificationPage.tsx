"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  XCircle,
} from "lucide-react";
import Avatar from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Link } from "react-router";
import { useNotifications } from "../context/NotificationContext";
import { NotificationPayload } from "../typings/types";
import {
  NotificationStatusEnum,
  UserModel,
  UserTypeEnum,
} from "../typings/models";
import apiService from "../services/api.service";

export default function NotificationsPage() {
  const { notifications, setNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  // Check if scrolling indicators should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (tabsContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          tabsContainerRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
      }
    };

    // Initial check
    checkScroll();

    // Add event listener for scroll
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
      tabsContainer.addEventListener("scroll", checkScroll);

      // Also check on window resize
      window.addEventListener("resize", checkScroll);

      return () => {
        tabsContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200; // Adjust as needed
      const currentScroll = tabsContainerRef.current.scrollLeft;

      tabsContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScroll - scrollAmount
            : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const markAsRead = async (id: string) => {
    apiService.put(`/notifications/${id}/read`, null);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    apiService.put("/notifications/read-all", null);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteAllNotifications = async () => {
    apiService.delete(`/notifications/all`);
    setNotifications([]);
  };

  const getStatusIcon = (status: NotificationStatusEnum) => {
    switch (status) {
      case NotificationStatusEnum.OPEN:
        return <Bell className="h-4 w-4 text-blue-500" />;
      case NotificationStatusEnum.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case NotificationStatusEnum.REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case NotificationStatusEnum.CANCELED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case NotificationStatusEnum.DONE:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case NotificationStatusEnum.RATED:
        return <Star className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: NotificationStatusEnum) => {
    switch (status) {
      case NotificationStatusEnum.OPEN:
        return "blue";
      case NotificationStatusEnum.IN_PROGRESS:
        return "yellow";
      case NotificationStatusEnum.REJECTED:
        return "red";
      case NotificationStatusEnum.CANCELED:
        return "red";
      case NotificationStatusEnum.DONE:
        return "green";
      case NotificationStatusEnum.RATED:
        return "amber";
      default:
        return "gray";
    }
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };
  const getTranslatedUrgency = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "Urggență ridicată";
      case "medium":
        return "Urgență medie";
      case "low":
        return "Urgență scăzută";
      default:
        return urgency;
    }
  };
  const getTranslatedStatus = (status: NotificationStatusEnum) => {
    switch (status) {
      case NotificationStatusEnum.OPEN:
        return "Disponibil";
      case NotificationStatusEnum.IN_PROGRESS:
        return "În progres";
      case NotificationStatusEnum.REJECTED:
        return "Respins";
      case NotificationStatusEnum.CANCELED:
        return "Anulat";
      case NotificationStatusEnum.DONE:
        return "Finalizat";
      case NotificationStatusEnum.RATED:
        return "Evaluat";
      default:
        return "Necunoscut";
    }
  };
  

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    // Less than a minute
    if (diff < 60000) {
      return "Acum";
    }
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? "s" : ""} în urmă`;
    }
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? "s" : ""} în urmă`;
    }
    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days > 1 ? "s" : ""} în urmă`;
    }

    // Default to date format
    return new Date(date).toLocaleDateString();
  };

  const getNotificationMessage = (notification: NotificationPayload) => {
    // Determine who performed the action based on status
    let actor = "";
    if (
      notification.status === NotificationStatusEnum.IN_PROGRESS &&
      notification.volunteerUsername
    ) {
      actor = `Voluntar ${notification.volunteerUsername}`;
    } else if (notification.beneficiaryUsername) {
      actor = `Beneficiar ${notification.beneficiaryUsername}`;
    }

    // Special handling for ratings
    if (notification.status === NotificationStatusEnum.RATED) {
      if (
        notification.recipientRole === UserTypeEnum.VOLUNTEER &&
        notification.beneficiaryUsername
      ) {
        return `Beneficiarul ${
          notification.beneficiaryUsername
        } a evaluat ajutorul tău cu ${notification.rating} stele{
          notification.rating !== 1 ? "s" : ""
        }`;
      } else if (
        notification.recipientRole === UserTypeEnum.BENEFICIARY &&
        notification.volunteerUsername
      ) {
        return `Voluntarul ${
          notification.volunteerUsername
        } a evaluat cererea ta cu ${notification.rating} stele${
          notification.rating !== 1 ? "s" : ""
        }`;
      }
      return `Cererea a fost evaluat cu ${notification.rating} stele${
        notification.rating !== 1 ? "s" : ""
      }`;
    }

    switch (notification.status) {
      case NotificationStatusEnum.OPEN:
        return `${actor ? actor + " a creat o" : "A fost creată o"} cerere nouă`;
      case NotificationStatusEnum.IN_PROGRESS:
        return `${actor ? actor + " a acceptat" : "Cerere acceptată"}`;
      case NotificationStatusEnum.REJECTED:
        return `${actor ? actor + " a respins" : "Cerere respinsă"}`;
      case NotificationStatusEnum.CANCELED:
        return `${actor ? actor + " a anulat" : "Cerere anulată"}`;
      case NotificationStatusEnum.DONE:
        return `${actor ? actor + " a finalizat" : "Cerere finalizată"}`;
      default:
        return `Actualizare privind o cerere`;
    }
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.status.toString().toLowerCase() === activeTab;
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // Custom tabs data
  const tabs = [
    {
      id: "all",
      label: "Toate",
      count: notifications.length,
      countClass: "bg-gray-200 text-gray-800",
    },
    {
      id: "unread",
      label: "Necitite",
      count: unreadCount,
      countClass: "bg-red-100 text-red-800",
    },
    { id: "open", label: "Disponibile", count: null, countClass: "" },
    { id: "in_progress", label: "În progres", count: null, countClass: "" },
    { id: "done", label: "Finalizate", count: null, countClass: "" },
    { id: "canceled", label: "Anulate", count: null, countClass: "" },
    { id: "rated", label: "Recenzii", count: null, countClass: "" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notificări</h1>
        {unreadCount > 0 && (
          <div
          onClick={markAllAsRead}
          className="w-full text-center text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
        >
          Marchează<br /> toate ca citite
        </div>
        )}

        {notifications.length > 0 && (
         <button
  onClick={() => deleteAllNotifications()}
  className="text-xs text-red-600 hover:underline"
>
  Șterge toate

         </button>
        )}
      </div>

      {/* Mobile-friendly Tabs */}
      <div className="relative mb-6">
        {/* Left scroll button */}
        {showLeftScroll && (
          <div
            onClick={() => scrollTabs("left")}
            className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 bg-opacity-80 rounded-full p-1 shadow-sm"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </div>
        )}

        {/* Scrollable tabs container */}
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex min-w-full">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab={tab.id}
                className={`px-3  cursor-pointer py-2 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span
                    className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${tab.countClass}`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right scroll button */}
        {showRightScroll && (
          <div
            onClick={() => scrollTabs("right")}
            className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 bg-opacity-80 rounded-full p-1 shadow-sm"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-900 hover:bg-gray-50 cursor-pointer rounded-lg border shadow-sm p-4 transition-colors ${
                !notification.isRead ? "border-l-4 border-l-blue-500" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <Link
                      to={`/app/requests/${notification.requestId}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notification.requestTitle}
                    </Link>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDate(notification.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {getNotificationMessage(notification)}
                  </p>

                  {/* Show star rating for rated notifications */}
                  {notification.status === NotificationStatusEnum.RATED &&
                    notification.rating && (
                      <div className="mt-1">
                        {renderStarRating(notification.rating)}
                      </div>
                    )}

                  {/* Show rating comment if available */}
                  {notification.status === NotificationStatusEnum.RATED &&
                    notification.ratingComment && (
                      <div className="mt-2 text-xs sm:text-sm italic text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
                        "{notification.ratingComment}"
                      </div>
                    )}

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant={getStatusBadgeVariant(notification.status)}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(notification.status)}
                      <span>{getTranslatedStatus(notification.status)}</span>

                    </Badge>

                    <Badge
                      variant={getUrgencyBadgeVariant(
                        notification.requestUrgency
                      )}
                    >
                      {getTranslatedUrgency(notification.requestUrgency)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    {notification.volunteerUsername && (
                      <div className="flex items-center gap-2">
                        <Avatar
                          user={
                            {
                              username: notification.volunteerUsername,
                              profileImg: notification.volunteerProfileImg,
                              isVerified: true,
                            } as UserModel
                          }
                        />
                        <Link
                          to={`/app/user/${notification.volunteerId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.volunteerUsername}
                        </Link>
                      </div>
                    )}

                    {notification.beneficiaryUsername && (
                      <div className="flex items-center gap-2">
                        <Avatar
                          user={
                            {
                              username: notification.beneficiaryUsername,
                              profileImg: notification.beneficiaryProfileImg,
                              isVerified: true,
                            } as UserModel
                          }
                        />
                        <Link
                          to={`/app/users/${notification.beneficiaryId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {notification.beneficiaryUsername}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No notifications
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {activeTab === "all"
                ? "Nu ai încă nici o notificare"
                : activeTab === "unread"
                ? "Nu ai notificări necitite."
                : `Nu ai notificări din categoria ${activeTab}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
