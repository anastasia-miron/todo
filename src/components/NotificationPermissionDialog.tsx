import { useState, useEffect } from "react";
import { Bell, BellOff, X, Settings } from "lucide-react";
import NotificationSettingsDemo from "./NotificationSettingsDemo";
import useCurrentUser from "../hooks/useCurrentUser";
import useAbortSignal from "../hooks/useAbortSignal";
import apiService from "../services/api.service";
import { toast } from "react-toastify";

export default function NotificationPermissionDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettingsHelp, setShowSettingsHelp] = useState(false);
  const signal = useAbortSignal();
  const { user, updateUser } = useCurrentUser();

  useEffect(() => {
    if (user && user.isFirstVisit) {
      const timer = setTimeout(() => {
        setShowDialog(true);
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const markFirstVisitSeen = async () => {
      const responseUserRequest = await apiService.post<string>(
        `/auth/mark-first-visit-seen`,
        {
          signal,
        }
      );

      if (!responseUserRequest.success) {
        return toast.error(responseUserRequest.message);
      }

      updateUser(responseUserRequest.data);
    };

    if (!showDialog && !isLoading) {
      markFirstVisitSeen();
    }
  }, [showDialog, isLoading]);

  const requestPermission = async () => {
    await apiService.post(`/push/allowNotifications`, {
      data: {
        allowNotifications: true,
      },
      signal,
    });

    if (signal.aborted) return;

    setShowDialog(false);
  };

  const dismissDialog = async () => {
    await apiService.post(`/push/allowNotifications`, {
      data: {
        allowNotifications: false,
      },
      signal,
    });

    setShowDialog(false);
  };

  const toggleSettingsHelp = () => {
    setShowSettingsHelp(!showSettingsHelp);
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md mx-4 relative">
        <div className="flex flex-col items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full mb-4">
            <Bell className="text-blue-600" size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Rămâi Informat</h2>
          <p className="text-gray-600 text-center mb-2">
          Activează notificările pentru a fi la curent cu actualizările,
           reamintirile și informațiile importante.
          </p>

          {!showSettingsHelp ? (
            <button
              onClick={toggleSettingsHelp}
              className="text-blue-600 text-sm flex items-center gap-1"
            >
              <Settings size={14} />
              Cum activez mai târziu din setări?
            </button>
          ) : (
            <NotificationSettingsDemo />
          )}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={requestPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Bell size={20} />
            Activează notificările
          </button>

          <button
            onClick={dismissDialog}
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <BellOff size={20} />
            Nu acum
          </button>
        </div>
      </div>
    </div>
  );
}
