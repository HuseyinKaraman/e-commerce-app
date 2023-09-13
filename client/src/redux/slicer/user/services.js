import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUserApiRequest = createAsyncThunk("user/loginUserApiRequest", async (values) => {
    try {
        const { data } = await axios.post("/api/users/login", {
            email: values.email,
            password: values.password,
            doNotLogout: values.doNotLogout,
        });

        if (data.userLoggedIn.doNotLogout) {
            localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn));
        } else {
            sessionStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn));
        }

        return data;
    } catch (error) {
        return error;
    }
});

export const registerUserApiRequest = createAsyncThunk("user/registerUserApiRequest", async (values) => {
    try {
        const { data } = await axios.post("/api/users/register", {
            name: values.name,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
        });

        if (data.userCreated) {
            sessionStorage.setItem("userInfo", JSON.stringify(data.userCreated));
        }

        return data;
    } catch (error) {
        return error;
    }
});

export const logout = createAsyncThunk("user/logout", async () => {
    window.location.href = "/login";
    try {
        const res = await axios.get("/api/logout");
        if (res.status === 200) {
            localStorage.removeItem("userInfo");
            sessionStorage.removeItem("userInfo");
            localStorage.removeItem("cart");
        }
    } catch (error) {
        return error;
    }
});

export const updateUserApiRequest = createAsyncThunk("user/updateUserApiRequest", async (values) => {
    try {
        const { data } = await axios.put("/api/users/profile", {
            name: values.name,
            lastName: values.lastName,
            password: values.password,
            phoneNumber: values.phoneNumber,
            address: values.address,
            country: values.country,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
        });

        return data;
    } catch (error) {
        return error;
    }
});

export const fetchUserDetail = createAsyncThunk("user/fetchUserDetailApiRequest", async (id) => {
    try {
        const { data } = await axios.get("/api/users/profile/" + id);

        sessionStorage.setItem( "details",
            JSON.stringify({
                address: data.address,
                city: data.city,
                country: data.country,
                phoneNumber: data.phoneNumber,
                state: data.state,
                zipCode: data.zipCode,
            })
        );

        return data;
    } catch (error) {
        return error;
    }
});
