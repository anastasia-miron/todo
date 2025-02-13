import React from "react";
import Logo from "../components/Logo";
import { Navigate, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useFormik } from "formik";
import { loginSchema } from "../schemas";
import apiService from "../services/api.service";
import { toast } from 'react-toastify';
import useAbortSignal from "../hooks/useAbortSignal";
import useCurrentUser from "../hooks/useCurrentUser";

const DEFAULT_VALUES = {
    email: '',
    password: ''
};

const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const signal = useAbortSignal();
    const {user, updateUser} = useCurrentUser();

    const { values, handleSubmit, setFieldValue, dirty, isValid } = useFormik({
        initialValues: DEFAULT_VALUES,
        validationSchema: loginSchema,
        onSubmit: async (data) => {
            const response = await apiService.post<string>('/auth/login', data, { signal });
            if (signal.aborted) return;
            if (!response.success) {
                return toast.error(response.message);
            }
            
            updateUser(response.data);
            await navigate('/app/profile', { replace: true });

        }
    });

    if (user) {
        return <Navigate to="/app/profile" />
    }

    return (
        <div className="page">
            <form onSubmit={handleSubmit}>
                <div className="page__header">
                    <ChevronLeft onClick={() => navigate(-1)} className="back-btn" />
                    <Logo className="page__logo" onClick={() => navigate('/')} />
                    <div className="btn-placeholder" />
                </div>
                <h1>Sign In</h1>
                <div>
                    <fieldset>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={values.email}
                            onChange={(ev) => setFieldValue('email', ev.target.value)}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="*******"
                            value={values.password}
                            onChange={(ev) => setFieldValue('password', ev.target.value)}
                        />

                    </fieldset>
                </div>
                <div className="signin_page__actions">
                    <button type="submit" disabled={!dirty || !isValid}>Login</button>
                </div>
            </form>
        </div>
    );
}

export default SignInPage