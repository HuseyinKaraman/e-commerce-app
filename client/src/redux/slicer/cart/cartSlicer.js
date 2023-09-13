import { createSlice } from "@reduxjs/toolkit";
import { addToCart, createOrder } from "./services";

const cartItemsInLocalState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: cartItemsInLocalState,
        itemsCount: cartItemsInLocalState
            ? cartItemsInLocalState.reduce((quantity, item) => item.quantity + quantity, 0)
            : 0,
        cartSubTotal: cartItemsInLocalState
            ? cartItemsInLocalState.reduce((total, item) => item.price * item.quantity + total, 0)
            : 0,
        status: "idle",
        error: null,
        isLoading: false,
        orderId: null
    },
    reducers: {
        setStatusIdle: (state) => {
            state.status = "idle";
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item.productId !== action.payload.productId);
            state.itemsCount = state.itemsCount - action.payload.quantity;
            state.cartSubTotal = state.cartSubTotal - action.payload.quantity * action.payload.price;

            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.fulfilled, (state, action) => {
                const productAddedToCart = action.payload;
                if (productAddedToCart?.productId) {
                    const currentState = { ...state };
                    const findCartItem = state.cartItems.find(
                        (item) => item.productId === productAddedToCart.productId
                    );

                    if (findCartItem) {
                        const oldSum = findCartItem.quantity * findCartItem.price;
                        const newSum = productAddedToCart.quantity * productAddedToCart.price;
                        currentState.cartSubTotal += newSum - oldSum;
                        currentState.itemsCount += productAddedToCart.quantity - findCartItem.quantity;
                        findCartItem.quantity = productAddedToCart.quantity;
                    } else {
                        currentState.cartSubTotal += productAddedToCart.price * productAddedToCart.quantity;
                        currentState.itemsCount += productAddedToCart.quantity;
                        currentState.cartItems.push(productAddedToCart);
                    }
                    state.cartItems = currentState.cartItems;
                    state.itemsCount = currentState.itemsCount;
                    state.cartSubTotal = currentState.cartSubTotal;

                    state.status = "success";
                    localStorage.setItem("cart", JSON.stringify(state.cartItems));
                } else {
                    state.error = action.payload.response;
                    state.status = "error";
                }
                state.isLoading = false;
            })
            .addCase(addToCart.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.isLoading = false;
            })
            //* create order 
            .addCase(createOrder.fulfilled, (state, action) => {
                if (action.payload?._id) {
                    state.orderId = action.payload._id;
                    state.status = "order/success";
                    localStorage.removeItem("cart");
                } else {
                    state.error = action.payload.response;
                    state.status = "error";
                }
                state.isLoading = false;
            })
            .addCase(createOrder.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { setStatusIdle, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;

//! getProductById fulfilled alternative method:
// const productAddedToCart = action.payload;
// const productIsExistInCart = state.cartItems.find(
//     (item) => item.productId === productAddedToCart.productId
// );

// // not change directly the state
// const currentState = {...state};
// console.log(currentState);

// // todo : change the code for reduxjs/toolkit
// if (productIsExistInCart) {
//     currentState.itemsCount = 0;
//     currentState.cartSubTotal = 0;

//     currentState.cartItems = state.cartItems.map((item) => {
//         if (item.productId === productIsExistInCart.productId) {
//             currentState.itemsCount += productAddedToCart.quantity;
//             const sum = productAddedToCart.price * productAddedToCart.quantity;
//             currentState.cartSubTotal += sum;
//         } else {
//             currentState.itemsCount += item.quantity;
//             const sum = item.price * item.quantity;
//             currentState.cartSubTotal += sum;
//         }
//         return item.productId === productAddedToCart.productId ? productAddedToCart : item;
//     });
// } else {
//     currentState.itemsCount += productAddedToCart.quantity;
//     const sum = productAddedToCart.price * productAddedToCart.quantity;
//     currentState.cartSubTotal += sum;
//     currentState.cartItems = [...currentState.cartItems , productAddedToCart];
// }
// console.log(currentState);

// state.cartItems = currentState.cartItems;
// state.itemsCount = currentState.itemsCount;
// state.cartSubTotal = currentState.cartSubTotal;
