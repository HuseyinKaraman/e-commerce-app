import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCategories = createAsyncThunk("category/getCategories", async () => {
    try {
        const { data } = await axios.get("/api/categories");
        return data;
    } catch (error) {
        return error;
    }
});

// save attrs to category document
export const saveAttributeToCatDoc = createAsyncThunk("category/saveAttributeToCatDoc", async (input) => {
    try {
        const { data } = await axios.post("/api/categories/attr", {
            key: input.key,
            val: input.val,
            categoryChoosen: input.categoryChoosen,
        });

        return data;
    } catch (error) {
        return error;
    }
});

export const newCategory = createAsyncThunk("category/newCategory", async (categoryName) => {
    try {
        const { data } = await axios.post("/api/categories",{
            category:categoryName
        });
        return data;
    } catch (error) {
        return error
    }
});

export const deleteCategory = createAsyncThunk("category/deleteCategory", async (categoryName) => {
    try {
        const { data } = await axios.delete("/api/categories/"+encodeURIComponent(categoryName));
        return data;
    } catch (error) {
        return error
    }
});
