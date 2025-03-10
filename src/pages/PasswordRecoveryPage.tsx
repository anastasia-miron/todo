import React, { useState } from "react";
import Logo from "../components/Logo";
import {useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useFormik } from "formik";
import { recoverySchema } from "../schemas";
import apiService from "../services/api.service";
import { toast } from "react-toastify";
import useAbortSignal from "../hooks/useAbortSignal";
import "./PasswordRecoveryPage.css";    


const DEFAULT_VALUES = {
    email: ""
};

const RecoveryPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const signal = useAbortSignal();
    const [emailSent, setEmailSent] = useState(false);

    const { values, handleSubmit, setFieldValue, errors, touched } = useFormik({
        initialValues: DEFAULT_VALUES,
        validationSchema: recoverySchema,
        onSubmit: async (data) => {
            const response = await apiService.post<string>("/auth/password-recovery", data, { signal });
            if (signal.aborted) return;
            if (!response.success) {
                return toast.error(response.message);
            }
            setEmailSent(true);
            toast.success("Password reset link sent to your email!");
        }
    });

    return (
        <div className="page">
            <form onSubmit={handleSubmit}>
                <div className="page__header">
                    <ChevronLeft onClick={() => navigate(-1)} className="back-btn" />
                    <Logo className="page__logo" onClick={() => navigate("/")} />
                    <div className="btn-placeholder" />
                </div>
                <article>
                <h1 className="recovery-page">Password recovery</h1>
                <p className="recovery-page__text">
                 Please enter your email address. We'll send you a link to reset your password.
                </p>
                <div>
                    <fieldset>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={values.email}
                            onChange={(ev) => setFieldValue("email", ev.target.value)}
                        />
                        {errors.email && touched.email && (
                            <div className="error">{errors.email}</div>
                        )}
                    </fieldset>
                </div>
                <div className="recovery-page__actions">
                    <button type="submit" disabled={emailSent}>Send Reset Link</button>
                </div>
                </article>
            </form>
        </div>
    );
};

export default RecoveryPasswordPage;
