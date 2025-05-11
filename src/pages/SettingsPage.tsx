import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import apiService from "../services/api.service";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import "./UserPage.css";
import { Bell } from "lucide-react";
import { NotificationStatus } from "../typings/types";
import NotificationPermissionWarning from "../components/NotificationPermissionWarning";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      const response = await apiService.get<NotificationStatus>(
        "/push/getIsNotificationEnabled"
      );

      console.log("test");
      if (response.success) {
        setEnabled(response.data.allowNotifications);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      toast.error("Please enter a new password.");
      return;
    }
    const response = await apiService.post("/profile/update-password", {
      newPassword,
    });
    if (!response.success) {
      toast.error("Failed to update password. Please try again.");
      return;
    }

    toast.success("Password updated successfully.");
    setNewPassword("");
  };

  const handleDeleteAccount = async () => {
    const response = await apiService.delete("/profile");
    if (!response.success) {
      toast.error("Failed to delete account. Please try again.");
      return;
    }
    toast.success("Your account has been deleted.");
    navigate("/"); // Redirecționează la pagina principală
  };

  const handleAllowNotifications = async () => {
    const response = await apiService.post("/push/allowNotifications", {
      allowNotifications: !enabled,
    });

    setEnabled(!enabled);

    if (!response.success) {
      toast.error("Failed to update notification settings. Please try again.");
      return;
    }

    toast.success("Notification settings updated successfully.");
  };

  return (
    <div>
      <h2>Settings</h2>

      <article className="relative flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <Bell className="text-gray-600" size={20} />
          <span className="font-medium text-gray-700">Allow Notifications</span>
        </div>

        <span
          onClick={handleAllowNotifications}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            enabled ? "bg-blue-500" : "bg-gray-300"
          } `}
        >
          <span
            className={`transform transition-transform bg-white dark:bg-gray-900 w-5 h-5 rounded-full shadow ${
              enabled ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </span>
      </article>
      <NotificationPermissionWarning />
      <article className="user-settings">
        <header>Change Password</header>
        <label htmlFor="password">New password</label>
        <input
          type="password"
          name="password"
          placeholder="*******"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <footer>
          <button onClick={handleUpdatePassword}>Update</button>
        </footer>
      </article>
      <article className="user-settings">
        <header>Delete Account</header>
        <p>You will no longer be able to sign in to your account</p>
        <footer>
          <button className="danger-btn" onClick={() => setConfirmDelete(true)}>
            Delete
          </button>
        </footer>
      </article>

      {confirmDelete && (
        <ConfirmModal
          message="Are you sure you want to delete your account?"
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDeleteAccount}
          open
        />
      )}
    </div>
  );
};

export default SettingsPage;
