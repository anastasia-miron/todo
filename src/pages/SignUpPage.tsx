import React from "react";
import Logo from "../components/Logo";
import { Navigate, useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useFormik } from "formik";
import { registerSchema } from "../schemas";
import apiService from "../services/api.service";
import { toast } from 'react-toastify';
import useAbortSignal from "../hooks/useAbortSignal";
import useCurrentUser from "../hooks/useCurrentUser";



const DEFAULT_VALUES = {
    username: '',
    email: '',
    phone: '',
    password: '',
    repeatPassword: ''
};

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const {user, updateUser} = useCurrentUser();
    const signal = useAbortSignal();

    const { values, handleSubmit, setFieldValue, errors, touched } = useFormik({
        initialValues: DEFAULT_VALUES,
        validationSchema: registerSchema,
        onSubmit: async (data) => {
            const response = await apiService.post<string>('/auth/register', data, { signal });
            if (signal.aborted) return;
            if (!response.success) {
                return toast.error(response.message);
            }
            updateUser(response.data);
            toast.success('Account created successfully!');
            await navigate('/app/user-type', { replace: true });
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
                <h1>Sign Up</h1>
                <div>
                    <fieldset>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            aria-invalid={errors.username ? "true" : "false"}
                            aria-describedby="error-username"
                            value={values.username}
                            onChange={(ev) => setFieldValue('username', ev.target.value)}
                        />
                        {errors.username && <small id="error-username">{errors.username}</small>}
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            aria-invalid={errors.email ? "true" : "false"}
                            aria-describedby="error-email"
                            placeholder="email@example.com"
                            value={values.email}
                            onChange={(ev) => setFieldValue('email', ev.target.value)}
                        />
                       {errors.email && <small id="error-email">{errors.email}</small>}
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="0XXXXXXXX"
                            aria-invalid={errors.phone ? "true" : "false"}
                            aria-describedby="error-phone"
                            value={values.phone}
                            onChange={(ev) => setFieldValue('phone', ev.target.value)}
                        />
                        {errors.phone && <small id="error-phone">{errors.phone}</small>}
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            aria-invalid={errors.phone ? "true" : "false"}
                            aria-describedby="error-phone"
                            placeholder="Password"
                            value={values.password}
                            onChange={(ev) => setFieldValue('password', ev.target.value)}
                        />
                        {errors.password && <small id="error-password">{errors.password}</small>}
                        <label htmlFor="repeatPassword">Repeat Password</label>
                        <input
                            type="password"
                            name="repeatPassword"
                            placeholder="Repeat Password"
                            value={values.repeatPassword}
                            onChange={(ev) => setFieldValue('repeatPassword', ev.target.value)}
                        />
                            {errors.repeatPassword && touched.repeatPassword && (
                            <div className="error">{errors.repeatPassword}</div> )}
                    </fieldset>
                </div>
                <div className="signup_page__actions">
                <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}

export default SignUpPage;
