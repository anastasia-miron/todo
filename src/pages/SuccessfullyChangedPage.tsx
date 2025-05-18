import React from "react";
import { Link, useNavigate } from "react-router";
import Logo from "../components/Logo";
import { ChevronLeft, CircleCheckBig } from "lucide-react";
import './SuccessfullyChangedPage.css'

const SuccessfullyChangedPage: React.FC = () => {
    const navigate = useNavigate();

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
                <div className="successfully-changed-page">
                    <CircleCheckBig className="successfully-changed-icon" />
                    <h1 className="successfully-changed-title">Parolă actualizată cu succes!</h1>
                    <p className="successfully-changed-text">
                        Întoarce-te la pagina de <Link className="successfully-changed-link" to="/sign-in">logare</Link>.
                    </p>
                </div>
            </article>
        </div>
    );
};

export default SuccessfullyChangedPage;
