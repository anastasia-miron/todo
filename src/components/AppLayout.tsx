import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import NavBar from "./NavBar";
import useCurrentUser from "../hooks/useCurrentUser";
import { UserTypeEnum } from "../typings/models";

const AppLayout: React.FC = () => {
    const {user} = useCurrentUser();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/sign-in" />
    }

    console.log(user, location.pathname)

    if (user.type === UserTypeEnum.NONE && location.pathname !== "/app/user-type") {
        return <Navigate to="/app/user-type" />
    } 

    if (user.type !== UserTypeEnum.NONE && location.pathname === "/app/user-type") {
        return <Navigate to="/app/profile" />
    }

    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default AppLayout;