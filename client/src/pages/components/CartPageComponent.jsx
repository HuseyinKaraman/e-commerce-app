import { Button, Col, List, Row } from "antd";
import { Link } from "react-router-dom";
import CartItemComponent from "../../components/CartItemComponent";

const CartPageComponent = ({addToCart,removeFromCart,setStatusIdle,cartItems,cartSubTotal,itemsCount,dispatch,}) => {

    const changeCount = (id,quantity)=>{
        dispatch(addToCart({id,quantity}));
        setTimeout(() => dispatch(setStatusIdle()), 500);
    }

    const removeFromCartHandler = (productId,quantity,price)=>{
        dispatch(removeFromCart({productId,quantity,price}));
    }

    return (
        <>
            <Row className="justify-between">
                <h1 className="text-3xl mb-3 w-full text-center font-bold px-5">Shopping Cart</h1>
                <Col className="md:w-[72%] lg:w-[69%]">
                    <CartItemComponent dataSource={cartItems} changeCount={changeCount} removeFromCartHandler={removeFromCartHandler}/>
                </Col>
                <Col className="mt-[25px] ml-auto md:mx-auto md:w-[25%] w-3/5 pr-2 mb-6">
                    <List bordered>
                        <List.Item>
                            <h3 className="font-semibold text-xl">Subtotal ({itemsCount} items)</h3>
                        </List.Item>
                        <List.Item className="text-lg">
                            Price:<span className="ml-1 font-bold">{cartSubTotal}$</span>
                        </List.Item>
                        <List.Item>
                            <Link to="/user/cart-details" className="w-full">
                                <Button type="primary" className="w-full" disabled={cartSubTotal === 0}>
                                    Proced To Checkout
                                </Button>
                            </Link>
                        </List.Item>
                    </List>
                </Col>
            </Row>
        </>
    );
};

export default CartPageComponent;
