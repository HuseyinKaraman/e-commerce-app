import CartPageComponent from "./components/CartPageComponent";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slicer/cart/services";
import { removeFromCart, fetchUserDetail } from "../redux/slicer/cart/cartSlicer";

const CartPage = () => {
    const dispatch = useDispatch();
    const { cartItems, cartSubTotal, itemsCount } = useSelector((state) => state.cart);

    return (
        <CartPageComponent
            dispatch={dispatch}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
           // fetchUserDetail={fetchUserDetail}
            cartItems={cartItems}
            cartSubTotal={cartSubTotal}
            itemsCount={itemsCount}
        />
    );
};

export default CartPage;
