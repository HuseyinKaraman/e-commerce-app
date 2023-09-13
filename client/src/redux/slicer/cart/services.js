import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk("cart/addToCart", async (addedProductInfo, { getState }) => {
    try {
        const { data } = await axios.get("/api/products/get-one/" + addedProductInfo.id);

        return {
            productId: data._id,
            name: data.name,
            price: data.price,
            image: data.images[0] ?? null,
            count: data.count,
            quantity: addedProductInfo.quantity,
        };
    } catch (error) {
        return error;
    }
});

export const createOrder = createAsyncThunk("cart/createOrder", async (orderData) => {
    try {
        const { data } = await axios.post("/api/orders", { ...orderData });
        return data;
    } catch (error) {
        return error;
    }
});
