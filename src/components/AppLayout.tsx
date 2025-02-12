import React from "react";
import { Outlet } from "react-router";
import NavBar from "./NavBar";

const AppLayout: React.FC = () => {
    return (
        <div>
            <NavBar />
            <h1>AppLayout</h1>
            <Outlet />
        </div>
    );
};

export default AppLayout;