import { configureStore } from "@reduxjs/toolkit";
import  cartSlicer from './slicer/cart/cartSlicer';
import  userSlicer from './slicer/user/userSlicer';
import  categorySlicer from './slicer/category/categorySlicer';

export const store = configureStore({
    reducer: {
        cart:cartSlicer,
        user:userSlicer,
        category:categorySlicer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
