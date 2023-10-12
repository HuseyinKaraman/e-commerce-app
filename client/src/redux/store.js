import { configureStore } from "@reduxjs/toolkit";
import cartSlicer from "./slicer/cart/cartSlicer";
import userSlicer from "./slicer/user/userSlicer";
import categorySlicer from "./slicer/category/categorySlicer";
import adminChatSlicer from "./slicer/chat/chatSlicer";

export const store = configureStore({
    reducer: {
        cart: cartSlicer,
        user: userSlicer,
        category: categorySlicer,
        adminChat: adminChatSlicer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
