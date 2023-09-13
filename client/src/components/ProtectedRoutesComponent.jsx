import UserChatComponent from "./user/UserChatComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import LoginPage from "../pages/auth/LoginPage";
import { Navigate, Outlet } from "react-router-dom";
import { message } from "antd";

const ProtectedRoutesComponent = ({ admin }) => {
    const [isAuth, setIsAuth] = useState();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        axios
            .get("/api/get-token")
            .then((res) => {
                if (res.data.token) {
                    setIsAuth(res.data.token);
                }
                // return isAuth;
            })
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.response.data,
                });
            });
    }, [isAuth, messageApi, admin]);

    if (!isAuth) {
        return (
            <>
                {contextHolder}
                <LoginPage />
            </>
        );
    }

    // todo : change this
    return isAuth && admin && isAuth !== "admin" ? (
        <Navigate to="/login" state={{ content: "Unauthorized" }} />
    ) : isAuth && admin ? (
        <Outlet />
    ) : isAuth && !admin ? (
        <>
            <UserChatComponent /> <Outlet />
        </>
    ) : (
        <Navigate to="/login" state={{ content: "Login first" }} />
    );
};

export default ProtectedRoutesComponent;

/**
 *  return isAuth && admin ? (
        <Outlet />
    ) : isAuth && !admin ? (
        <>
            <UserChatComponent /> <Outlet />
        </>
    ) : (
        <Navigate to="/login" state={{ content: "Login first" }} />
    );
 */