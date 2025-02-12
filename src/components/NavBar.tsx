import { useLocation, useNavigate, useNavigation } from "react-router";
import { user } from "../mock";
import Avatar from "./Avatar";
import Logo from "./Logo";
import "./NavBar.css"
import { ChevronLeft } from "lucide-react";
import { useMemo } from "react";
const NavBar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const userData = useMemo(() => {
        if(location.pathname.includes('/app/')) {
            return user;
        } 
        return null;
    }, [location.pathname])

    return (
        <div className="navbar">
            {location.pathname !== "/app/" ? <ChevronLeft /> : <div className="navbar__placeholder" />}
            <Logo onClick={() => { navigate('/app/')}} />
            {userData && <Avatar user={userData} className="navbar__avatar" />}
        </div>
    );
}

export default NavBar

