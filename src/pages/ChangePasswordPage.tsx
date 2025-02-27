import React, { useState } from "react";
import Logo from "../components/Logo";
import { useNavigate, useSearchParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useFormik } from "formik";
import apiService from "../services/api.service";
import { toast } from "react-toastify";
import useAbortSignal from "../hooks/useAbortSignal";
import { changePasswordSchema } from "../schemas";
import NotFoundPage from "./NotFoundPage";

const DEFAULT_VALUES = {
    newPassword: "",
    repeatPassword: ""
};


const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [search] = useSearchParams();
    const signal = useAbortSignal();
    const [passwordChanged, setPasswordChanged] = useState(false);
    const token = search.get("token");
    console.log()

    const { values, handleSubmit, setFieldValue, errors, touched } = useFormik({
        initialValues: DEFAULT_VALUES,
        validationSchema: changePasswordSchema,

        onSubmit: async (data) => {
            
            const response = await apiService.post<string>("/change-password", {...data, token}, { signal });
            if (signal.aborted) return;
            if (!response.success) {
                return toast.error(response.message);
            }
            setPasswordChanged(true);
            toast.success("Password changed successfully!");
            await navigate('/app/profile', { replace: true });
        }
    });

    if(!token) {
        return <NotFoundPage />
    }

    return (
        <div className="page">
            <form onSubmit={handleSubmit}>
                <div className="page__header">
                    <ChevronLeft onClick={() => navigate(-1)} className="back-btn" />
                    <Logo className="page__logo" onClick={() => navigate("/")} />
                    <div className="btn-placeholder" />
                </div>
                <h1>Change Password</h1>
                <div>
                    <fieldset>
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={values.newPassword}
                            onChange={(ev) => setFieldValue("newPassword", ev.target.value)}
                        />
                        {errors.newPassword && touched.newPassword && (
                            <div className="error">{errors.newPassword}</div>
                        )}
                        
                        <label htmlFor="repeatPassword">Repeat Password</label>
                        <input
                            type="password"
                            name="repeatPassword"
                            placeholder="Repeat new password"
                            value={values.repeatPassword}
                            onChange={(ev) => setFieldValue("repeatPassword", ev.target.value)}
                        />
                        {errors.repeatPassword && touched.repeatPassword && (
                            <div className="error">{errors.repeatPassword}</div>
                        )}
                    </fieldset>
                </div>
                <div>
                    <button type="submit" disabled={passwordChanged}>Confirm</button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordPage;
