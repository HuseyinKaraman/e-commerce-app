import { createSlice } from "@reduxjs/toolkit";
import { getCategories, saveAttributeToCatDoc,newCategory,deleteCategory } from "./services";

export const categorySlice = createSlice({
    name: "cart",
    initialState: {
        categories: [],
        error: null,
        isLoading: false,
        message: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.fulfilled, (state, action) => {
                const categories = action.payload;
                if (categories?.length >= 0) {
                    state.categories = categories;
                } else {
                    state.error = action.payload.response;
                }
                state.isLoading = false;
            })
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(saveAttributeToCatDoc.fulfilled, (state, action) => {
                if (action.payload?.categoryUpdated) {
                    state.categories = action.payload.categoryUpdated
                } else {
                    console.log(action.payload);
                }
                state.isLoading = false;
            })
            .addCase(saveAttributeToCatDoc.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(saveAttributeToCatDoc.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(newCategory.fulfilled, (state, action) => {
                if (action.payload?.categoryCreated) {
                    state.categories.push(action.payload.categoryCreated);
                    state.message = "Category is added";
                } else {
                    state.message = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(newCategory.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(newCategory.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                if (action.payload?.isCategoryDeleted) {
                    let newCategories = state.categories.filter(category => category.name !== action.payload.deletedCategory);
                        state.categories = [
                            ...newCategories
                        ];
                        state.message = "Category is deleted!";
                } else {
                    state.message = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(deleteCategory.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export default categorySlice.reducer;
