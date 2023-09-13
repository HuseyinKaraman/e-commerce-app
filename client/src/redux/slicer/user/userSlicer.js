import { createSlice } from "@reduxjs/toolkit";
import { loginUserApiRequest, registerUserApiRequest, logout, updateUserApiRequest, fetchUserDetail } from "./services";

const userInfoLocalStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo"))
    : {};

const details = sessionStorage.getItem("details") ? JSON.parse(sessionStorage.getItem("details")) : {};

export const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: userInfoLocalStorage,
        details: details,
        isLoading: false,
        error: null,
        status: "idle",
    },
    reducers: {
        setStatusIdle: (state) => {
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            //* Login Api Request
            .addCase(loginUserApiRequest.fulfilled, (state, action) => {
                if (action.payload?.userLoggedIn) {
                    state.userInfo = action.payload.userLoggedIn;
                    state.status = "success";
                } else {
                    state.userInfo = {};
                    state.error = action.payload.response.data;
                    state.status = "error";
                }
                state.isLoading = false;
            })
            .addCase(loginUserApiRequest.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
            })
            .addCase(loginUserApiRequest.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.isLoading = false;
            })
            //* Register Api Request
            .addCase(registerUserApiRequest.fulfilled, (state, action) => {
                if (action.payload?.userCreated) {
                    state.userInfo = action.payload.userCreated;
                    state.status = "success";
                } else {
                    state.userInfo = {};
                    state.error = action.payload.response.data;
                    state.status = "error";
                }
                state.isLoading = false;
            })
            .addCase(registerUserApiRequest.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
            })
            .addCase(registerUserApiRequest.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.isLoading = false;
            })
            //* Logout Api Request
            .addCase(logout.fulfilled, (state) => {
                state.userInfo = {};
                state.details = {};
                state.status = "idle";
            })
            //* Update Api Request
            .addCase(updateUserApiRequest.fulfilled, (state, action) => {
                if (action.payload?.userUpdated) {
                    state.userInfo = { doNotLogout: state.userInfo.doNotLogout, ...action.payload.userUpdated };
                    state.status = "Update/success";
                    if (state.userInfo.doNotLogout) {
                        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
                    } else {
                        sessionStorage.setItem("userInfo", JSON.stringify(state.userInfo));
                    }
                } else {
                    state.userInfo = {};
                    state.error = action.payload.response;
                    state.status = "error";
                }
                state.isLoading = false;
            })
            .addCase(updateUserApiRequest.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
            })
            .addCase(updateUserApiRequest.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.isLoading = false;
            })
            //* fetch user information
            .addCase(fetchUserDetail.fulfilled, (state, action) => {
                if (action.payload?._id) {
                    state.details = {
                        address: action.payload.address,
                        country: action.payload.country,
                        city: action.payload.city,
                        phoneNumber: action.payload.phoneNumber,
                        zipCode: action.payload.zipCode,
                        state: action.payload.state,
                    };
                } else {
                    state.details = {};
                    state.error = action.payload.response.statusText;
                }
                state.isLoading = false;
            })
            .addCase(fetchUserDetail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserDetail.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { setStatusIdle, setToken } = userSlice.actions;
export default userSlice.reducer;
