import { useLocation, useNavigate, Link } from "react-router";
import Avatar from "./Avatar";
import Logo from "./Logo";
import "./NavBar.css"
import { ChevronLeft } from "lucide-react";
import useCurrentUser from "../hooks/useCurrentUser";
import { useRef } from "react";

const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDetailsElement>(null);
    const { user, logout } = useCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/sign-in');
    }

    const handleClose = () => {
        if (!menuRef.current) return;
        menuRef.current.open = false;
    }

    return (
        <div className="navbar">
            {location.pathname !== "/app/" ? <ChevronLeft onClick={() => navigate(-1)} /> : <div className="navbar__placeholder" />}
            <Logo onClick={() => { navigate('/app/') }} />
            {user && <details ref={menuRef} className="dropdown navbar__menu">
                <summary role="menu">
                    <Avatar user={user} className="navbar__avatar" />
                </summary>
                <ul dir="rtl">
                    <li><Link to="/app/profile" onClick={handleClose}>Profile</Link></li>
                    <li><Link to="/app/settings" onClick={handleClose}>Settings</Link></li>
                    <li><Link to="/app/history" onClick={handleClose}>History</Link></li>
                    <li><Link to="/app/reviews" onClick={handleClose} >Reviews</Link></li>
                    <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
            </details>
            }
        </div>
    );
}

export default NavBar

