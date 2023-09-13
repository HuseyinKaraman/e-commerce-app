import UserCartDetailsPageComponent from "./components/UserCartDetailsPageComponent";
import { useDispatch, useSelector } from "react-redux";
import { addToCart,createOrder } from "../../redux/slicer/cart/services";
import { removeFromCart, setStatusIdle } from "../../redux/slicer/cart/cartSlicer";

const UserCartDetailsPage = () => {
    const dispatch = useDispatch();
    const { cartItems, cartSubTotal, itemsCount,error,isLoading,status,orderId } = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user);

    return (
        <UserCartDetailsPageComponent
            dispatch={dispatch}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            createOrder={createOrder}
            setStatusIdle={setStatusIdle}
            cartItems={cartItems}
            cartSubTotal={cartSubTotal}
            itemsCount={itemsCount}
            error={error}
            orderId={orderId}
            isLoading={isLoading}
            status={status}
            user={user}
        />
    );
};

export default UserCartDetailsPage;
