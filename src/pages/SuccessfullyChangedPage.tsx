import React from "react";
import { Link, useNavigate } from "react-router";
import Logo from "../components/Logo";
import { ChevronLeft } from "lucide-react";
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
            <div>
                <h1 className="successfully-changed-title"> Password Updated Successfully!</h1>
                <p className="successfully-changed-text">
                    Go back to the <Link className="successfully-changed-link" to="/sign-in">Login</Link> page.
                </p>
            </div>
        </div>
    );
};

export default SuccessfullyChangedPage;

