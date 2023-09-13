import React, { useEffect, useState } from "react";
import { Alert, Button, Col, List, Row, Select, Spin, message } from "antd";
import CartItemComponent from "../../../components/CartItemComponent";

import { useParams } from "react-router-dom";

const OrderDetailsPageComponent = ({ getOrder, markAsDelivered }) => {
    const { id } = useParams();
    const [messageApi, contextHolder] = message.useMessage();

    const [userInfo, setUserInfo] = useState({});
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [orderButtonMessage, setOrderButtonMessage] = useState("Mark as delivered");
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        getOrder(id)
            .then((order) => {
                setUserInfo(order.user);
                setPaymentMethod(order.paymentMethod);
                order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false);
                order.isDelivered ? setIsDelivered(order.deliveredAt) : setIsDelivered(false);
                setCartSubtotal(order.orderTotal.cartSubTotal);
                if (order.isDelivered) {
                    setOrderButtonMessage("Order is delivered");
                    setButtonDisabled(true);
                }
                setCartItems(
                    order.cartItems.map((item, idx) => {
                        return { ...item, key: idx };
                    })
                );
            })
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.response.data.message ? err.response.data.message : err.response.data,
                });
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isDelivered]);

    if (Object.keys(userInfo).length === 0) {
        return <Spin tip="Loading..." className="absolute w-full h-full top-[50%] right-[50%]" />
    }

    return (
        <>
            {contextHolder}
            <h1 className="text-3xl font-semibold text-center">Order Details</h1>
            <Row className="mt-[10px] px-2">
                <Col className="md:w-2/3 w-full">
                    <Row className="md:px-4">
                        <Col className="w-1/2 min-h-40">
                            <h2 className="text-xl font-semibold mb-2">Shipping</h2>
                            <p>
                                <b>Name</b>: {userInfo.name} {userInfo.lastName}
                            </p>
                            <p className="my-2">
                                <b>Address</b>: {userInfo.address} {userInfo.city} {userInfo.state} {userInfo.zipCode}
                            </p>
                            <p>
                                <b>Phone</b>: {userInfo.phoneNumber}
                            </p>
                            <Alert
                                message={isDelivered ? `Delivered At ${isDelivered}` : "Not Delivered!"}
                                type={`${isDelivered ? "success" : "error"}`}
                                className={`font-semibold ${
                                    isDelivered ? "text-green-600 bg-green-200" : "text-red-500 bg-red-200"
                                } mt-2 lg:w-11/12`}
                                showIcon
                                closable
                            />
                        </Col>
                        <Col className="w-1/2 px-2 md:px-4 min-h-40 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                                <Select
                                    className="w-full lg:w-2/3 payment-method__select my-2"
                                    value={paymentMethod}
                                    disabled
                                >
                                    <Select.Option value="pp">PayPal</Select.Option>
                                    <Select.Option value="cod">Cash on Delivery(delivery may be delayed)</Select.Option>
                                    <Select.Option value="cc">Credit Card</Select.Option>
                                </Select>
                            </div>
                            <Alert
                                message={isPaid ? `Paid At ${isPaid}` : "Not Paid yet!"}
                                type={`${isPaid ? "success" : "error"}`}
                                className={`font-semibold ${
                                    isPaid ? "text-green-600 bg-green-200" : "text-red-500 bg-red-200"
                                } mt-2 lg:w-11/12`}
                                closable
                                showIcon
                            />
                        </Col>
                    </Row>
                    <Row className="md:px-4">
                        <span className="text-xl my-4 font-semibold">Order Details</span>
                        <CartItemComponent dataSource={cartItems} size={"small"} scrollY={500} orderCreated={true} isProductId={false}/>
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
                            <Button
                                type="primary"
                                danger
                                className="w-full px-2"
                                disabled={buttonDisabled}
                                onClick={() => {
                                    markAsDelivered(id)
                                        .then((res) => {
                                            if (res) {
                                                setIsDelivered(true);
                                            }
                                        })
                                        .catch((err) => {
                                            messageApi.open({
                                                type: "error",
                                                content: err.response.data.message
                                                    ? err.response.data.message
                                                    : err.response.data,
                                            });
                                        });
                                }}
                            >
                                {orderButtonMessage}
                            </Button>
                        </List.Item>
                    </List>
                </Col>
            </Row>
        </>
    );
};

export default OrderDetailsPageComponent;
