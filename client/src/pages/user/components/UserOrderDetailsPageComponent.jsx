import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Col, List, Row, Select } from "antd";
import CartItemComponent from "../../../components/CartItemComponent";
import { useParams } from "react-router-dom";



const UserOrderDetailsPageComponent = ({ user, getOrder,loadPaypalScript }) => {
    const { id } = useParams();
    
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [orderButtonMessage, setOrderButtonMessage] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [isDelivered, setIsDelivered] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    
    const paypalContainer = useRef();

    useEffect(() => {
        getOrder(id).then((data) => {
            setPaymentMethod(data.paymentMethod);
            setCartItems(data.cartItems);
            setCartSubtotal(data.orderTotal.cartSubTotal);
            data.isDelivered ? setIsDelivered(data.deliveredAt) : setIsDelivered(false);
            data.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false);
            if (data.isPaid) {
                setOrderButtonMessage("Your order is finished");
                setButtonDisabled(true);
            } else {
                if (data.paymentMethod === "pp" || data.paymentMethod === "cc") {
                    setOrderButtonMessage("Pay for your order");
                } else if (data.paymentMethod === "cod") {
                    setButtonDisabled(true);
                    setOrderButtonMessage("Wait for your order. You pay on delivery");
                }
            }
        });
    }, [getOrder, id]);


    const orderHandler = ()=> {
        setButtonDisabled(true)
        if (paymentMethod === "pp" || paymentMethod === "cc") {
            setOrderButtonMessage("To pay for your order click one of the buttons below");
            if (!isPaid && paymentMethod === "pp") {
                // todo: load paypal script and do actions
                loadPaypalScript(cartSubtotal,cartItems,id,updateStateAfterOrder);
            }
        } else if (paymentMethod === "cod") {
            setOrderButtonMessage("You order was placed. Thank you!");
        }
    }

    const updateStateAfterOrder = (paidAt) => { 
        setOrderButtonMessage("Thank you for your payment!");
        setIsPaid(paidAt);
        setButtonDisabled(true);
        paypalContainer.current.style = "display: none";
    }

    return (
        <>
            <h1 className="text-3xl font-semibold text-center">Order Details</h1>
            <Row className="mt-[10px] px-2">
                <Col className="md:w-2/3 w-full">
                    <Row className="md:px-4">
                        <Col className="w-1/2 min-h-40">
                            <h2 className="text-xl font-semibold mb-2">Shipping</h2>
                            <p>
                                <b>Name</b>: {user.userInfo.name}
                            </p>
                            <p className="my-2">
                                <b>Address</b>: {user.details.address} {user.details.state} {user.details.city}{" "}
                                {user.details.zipCode} {user.details.country}
                            </p>
                            <p>
                                <b>Phone</b>: {user.details.phoneNumber}
                            </p>
                            <Alert
                                message={isDelivered ? <>Delivered! at {isDelivered} </> : "Not Delivered!"}
                                type={isDelivered ? "success" : "error"}
                                className={
                                    isDelivered
                                        ? "text-green-600 bg-green-200 font-semibold lg:w-11/12"
                                        : "font-semibold text-red-500 bg-red-200 mt-2 lg:w-11/12"
                                }
                                showIcon
                                closable
                            />
                        </Col>
                        <Col className="w-1/2 px-2 md:px-4 min-h-40 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                                <Select
                                    value={paymentMethod}
                                    className="w-full lg:w-2/3 payment-method__select my-2"
                                    disabled={true}
                                >
                                    <Select.Option value="pp">PayPal</Select.Option>
                                    <Select.Option value="cod">Cash on Delivery(delivery may be delayed)</Select.Option>
                                    <Select.Option value="cc">Credit Card</Select.Option>
                                </Select>
                            </div>
                            <Alert
                                message={isPaid ? <>Paid on {isPaid} </> : "Not Paid!"}
                                type={isPaid ? "success" : "error"}
                                className={
                                    isPaid
                                        ? "text-green-600 bg-green-200 font-semibold lg:w-11/12"
                                        : "font-semibold text-red-500 bg-red-200 mt-2 lg:w-11/12"
                                }
                                closable
                                showIcon
                            />
                        </Col>
                    </Row>
                    <Row className="md:px-4">
                        <span className="text-xl my-4 font-semibold">Order Details</span>
                        <CartItemComponent dataSource={cartItems} size={"small"} scrollY={500} isProductId={false} orderCreated={true}/>
                    </Row>
                </Col>
                <Col className="md:w-1/3 md:max-w-[400px] md:mx-auto w-full my-4 md:my-0">
                    <List bordered size="small">
                        <List.Item>
                            <h3 className="text-xl font-semibold">Order Summary</h3>{" "}
                        </List.Item>
                        <List.Item>
                            Items price (after tax): <span className="font-semibold">{cartSubtotal}$</span>
                        </List.Item>
                        <List.Item>
                            Shipping: <span className="font-semibold">included</span>
                        </List.Item>
                        <List.Item>
                            Tax: <span className="font-semibold">included</span>
                        </List.Item>
                        <List.Item className="!text-red-600">
                            Total Price: <span className="font-semibold">{cartSubtotal}$</span>
                        </List.Item>
                        <List.Item>
                            <Button type="primary" danger className="w-full px-2" disabled={buttonDisabled} onClick={orderHandler}>
                                {orderButtonMessage}
                            </Button>
                        </List.Item>    
                        <List.Item className="relative z-10">
                            <div id="paypal-container-element" ref={paypalContainer} className="!w-full"></div>
                        </List.Item>
                    </List>
                </Col>
            </Row>
        </>
    );
};

export default UserOrderDetailsPageComponent;
