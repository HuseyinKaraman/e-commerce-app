import CartPageComponent from "./components/CartPageComponent";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slicer/cart/services";
import { removeFromCart, setStatusIdle } from "../redux/slicer/cart/cartSlicer";

const CartPage = () => {
    const dispatch = useDispatch();
    const { cartItems, cartSubTotal, itemsCount } = useSelector((state) => state.cart);

    return (
        <CartPageComponent
            dispatch={dispatch}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
           setStatusIdle={setStatusIdle}
            cartItems={cartItems}
            cartSubTotal={cartSubTotal}
            itemsCount={itemsCount}
        />
    );
};

export default CartPage;
