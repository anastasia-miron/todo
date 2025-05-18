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

      if (response.success) {
        setEnabled(response.data.allowNotifications);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      toast.error("Vă rugăm să introduceți o parolă nouă.");
      return;
    }
    const response = await apiService.post("/profile/update-password", {
      newPassword,
    });
    if (!response.success) {
      toast.error("Actualizarea parolei a eșuat. Vă rugăm să încercați din nou.");
      return;
    }

    toast.success("Parola a fost actualizată cu succes.");
    setNewPassword("");
  };

  const handleDeleteAccount = async () => {
    const response = await apiService.delete("/profile");
    if (!response.success) {
      toast.error("Ștergerea contului a eșuat. Vă rugăm să încercați din nou.");
      return;
    }
    toast.success("Contul dvs. a fost șters.");
    navigate("/"); // Redirecționează la pagina principală
  };

  const handleAllowNotifications = async () => {
    const response = await apiService.post("/push/allowNotifications", {
      allowNotifications: !enabled,
    });

    setEnabled(!enabled);

    if (!response.success) {
      toast.error("Actualizarea setărilor notificărilor a eșuat. Vă rugăm să încercați din nou.");
      return;
    }

    toast.success("Setările notificărilor au fost actualizate cu succes.");
  };

  return (
    <div>
      <h2>Setări</h2>

      <article className="relative flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <Bell className="text-gray-600" size={20} />
          <span className="font-medium text-gray-700">Permite notificările</span>
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
        <header>Schimbă parola</header>
        <label htmlFor="password">Parolă nouă</label>
        <input
          type="password"
          name="password"
          placeholder="*******"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <footer>
          <button onClick={handleUpdatePassword}>Actualizează</button>
        </footer>
      </article>
      <article className="user-settings">
        <header>Șterge contul</header>
        <p>Nu veți mai putea să vă autentificați cu acest cont.</p>
        <footer>
          <button className="danger-btn" onClick={() => setConfirmDelete(true)}>
            Șterge
          </button>
        </footer>
      </article>

      {confirmDelete && (
        <ConfirmModal
          message="Sunteți sigur că doriți să vă ștergeți contul?"
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDeleteAccount}
          open
        />
      )}
    </div>
  );
};

export default SettingsPage;
