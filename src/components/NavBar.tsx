import { useLocation, useNavigate, useNavigation, Link } from "react-router";
import { user } from "../mock";
import Avatar from "./Avatar";
import Logo from "./Logo";
import "./NavBar.css"
import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/sign-in');
    }

    return (
        <div className="navbar">
            {location.pathname !== "/app/" ? <ChevronLeft onClick={() => navigate(-1)} /> : <div className="navbar__placeholder" />}
            <Logo onClick={() => { navigate('/app/') }} />
            {user && <details className="dropdown navbar__menu">
                <summary role="menu"><Avatar user={user} className="navbar__avatar" /></summary>
                <ul dir="rtl">
                    <li><Link to="/app/profile">Profile</Link></li>
                    <li><Link to="/app/settings">Settings</Link></li>
                    <li><Link to="/app/history">History</Link></li>
                    <li><Link to="/app/reviews">Reviews</Link></li>
                    <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
            </details>
            }
        </div>
    );
}

export default NavBar

