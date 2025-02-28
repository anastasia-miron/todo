import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Logo from "../components/Logo";
import { ChevronLeft } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import './VerificationPage.css'
import apiService from "../services/api.service";
import useAbortSignal from "../hooks/useAbortSignal";
import useToken from "../hooks/useToken";

const VerificationPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const {refreshToken} = useToken();
    const [search] = useSearchParams();
    const signal = useAbortSignal();

    const token = search.get('token');
    const email = search.get('email');

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await apiService.post('/auth/verification', { token, email }, { signal });
            if (signal.aborted) return;
            setIsLoading(false);
            if (!response.success) {
                setError(response.message);
                return;
            }
            await refreshToken();
        })();
    }, []);

    if (isLoading) {
        return (<article aria-busy="true" />)
    }

    if (error) {
        return (
            <div className="page">
                <form>
                    <div className="page__header">
                        <ChevronLeft onClick={() => navigate(-1)} className="back-btn" />
                        <Logo className="page__logo" onClick={() => navigate('/')} />
                        <div className="btn-placeholder" />
                    </div>
                </form>
                <article>{error}</article>
            </div>)
    }

    return (
        <div className="page">
            <form>
                <div className="page__header">
                    <ChevronLeft onClick={() => navigate(-1)} className="back-btn" />
                    <Logo className="page__logo" onClick={() => navigate('/')} />
                    <div className="btn-placeholder" />
                </div>
            </form>
            <article>
                <div className="verification-page">
                    <CircleCheckBig className="verification-icon" />
                    <h1 className="verification-title"> Your account has been successfully verified!</h1>
                    <p className="verification-text">
                        You can now <Link className="verification-link" to="/app">continue</Link> and start using all the features.
                    </p>
                </div>
            </article>
        </div>

    );
};

export default VerificationPage;

