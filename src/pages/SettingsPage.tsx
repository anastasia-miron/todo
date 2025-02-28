import React, { useState } from "react";
import { useNavigate } from "react-router";
import apiService from "../services/api.service";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import "./UserPage.css";

const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

const handleUpdatePassword = async () => {
        if (!newPassword.trim()) {
            toast.error("Please enter a new password.");
            return;
        }
const response = await apiService.post("/profile/update-password", { newPassword });
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

    return (
        <div>
            <h2>Settings</h2>
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
                    <button className="danger-btn" onClick={() => setConfirmDelete(true)}>Delete</button>
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
