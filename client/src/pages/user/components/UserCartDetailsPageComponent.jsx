import React, { useEffect, useState } from "react";
import { Alert, Button, Col, List, Row, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import CartItemComponent from "../../../components/CartItemComponent";

const UserCartDetailsPageComponent = ({
    addToCart,
    removeFromCart,
    createOrder,
    setStatusIdle,
    cartItems,
    cartSubTotal,
    itemsCount,
    status,
    isLoading,
    error,
    user,
    orderId,
    dispatch,
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("pp");

    useEffect(() => {
        if (
            !user.details.address ||
            !user.details.city ||
            !user.details.country ||
            !user.details.state ||
            !user.details.zipCode
        ) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }

        if (status === "order/success" && orderId) {
            dispatch(setStatusIdle());
            navigate("/user/order-details/"+orderId);
        } else if (status !== "idle") {
            dispatch(setStatusIdle());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        user.details.address,
        user.details.city,
        user.details.country,
        user.details.state,
        user.details.zipCode,
        user.userInfo._id,
        navigate,
        status,
    ]);

    if (error && status === "error") {
        messageApi.open({
            type: "error",
            content: error,
        });
    }

    const changeCount = (id, quantity) => {
        dispatch(addToCart({ id, quantity }));
    };

    const removeFromCartHandler = (productId, quantity, price) => {
        dispatch(removeFromCart({ productId, quantity, price }));
    };

    const orderHandler = () => {
        const orderData = {
            orderTotal: {
                itemsCount: itemsCount,
                cartSubTotal: cartSubTotal,
            },
            cartItems: cartItems.map((item) => {
                return {
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: { path: item.image ? item.image.path ?? null : null },
                    count: item.count,
                    quantity: item.quantity,
                };
            }),
            paymentMethod: paymentMethod,
        };
        dispatch(createOrder(orderData));
    };

    const choosePaymentMethod = (e) => {
        setPaymentMethod(e);
    };

    return (
        <>
            {contextHolder}
            <h1 className="text-3xl font-semibold text-center">Cart Details</h1>
            <Row className="mt-2 px-2">
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
                                message={
                                    <div>
                                        {buttonDisabled ? (
                                            <p>
                                                <CloseCircleOutlined className="text-xl mr-1" />
                                                In order to make order, fill out your profile with correct address, city
                                                etc.
                                            </p>
                                        ) : (
                                            <>
                                                <CloseCircleOutlined className="text-lg mr-1" />
                                                <span className="align-bottom">Not Delivered</span>
                                                <p>
                                                    In order to make order, fill out your profile with correct
                                                    address,city etc.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                }
                                className="font-semibold text-red-500 bg-red-200 mt-2 lg:w-11/12"
                                type="error"
                                closable
                            />
                        </Col>
                        <Col className="w-1/2 px-2 md:px-4 min-h-40 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
                                <Select
                                    defaultValue={paymentMethod}
                                    className="w-full lg:w-2/3 payment-method__select my-2"
                                    onChange={choosePaymentMethod}
                                >
                                    <Select.Option value="pp">PayPal</Select.Option>
                                    <Select.Option value="cod">Cash on Delivery(delivery may be delayed)</Select.Option>
                                    <Select.Option value="cc">Credit Card</Select.Option>
                                </Select>
                            </div>
                            <Alert
                                message="No paid yet"
                                type="info"
                                className="text-cyan-500 bg-cyan-200 font-semibold lg:w-11/12"
                                closable
                                showIcon
                            />
                        </Col>
                    </Row>
                    <Row className="md:px-4 mt-6">
                        <span className="text-xl my-3 font-semibold">Order Details</span>
                        <CartItemComponent
                            dataSource={cartItems}
                            changeCount={changeCount}
                            removeFromCartHandler={removeFromCartHandler}
                            size={"small"}
                            scrollY={480}
                        />
                    </Row>
                </Col>
                <Col className="md:w-1/3 md:max-w-[400px] md:mx-auto w-full my-4 md:my-0">
                    <List bordered size="small">
                        <List.Item>
                            <h3 className="text-xl font-semibold">Order Summary</h3>{" "}
                        </List.Item>
                        <List.Item>
                            Items price (after tax): <span className="font-semibold">{cartSubTotal}$</span>
                        </List.Item>
                        <List.Item>
                            Shipping: <span className="font-semibold">included</span>
                        </List.Item>
                        <List.Item>
                            Tax: <span className="font-semibold">included</span>
                        </List.Item>
                        <List.Item className="!text-red-600">
                            Total Price: <span className="font-semibold">{cartSubTotal}$</span>
                        </List.Item>
                        <List.Item>
                            <Button
                                type="primary"
                                danger
                                className="w-full px-2"
                                disabled={itemsCount === 0 || buttonDisabled}
                                loading={isLoading}
                                onClick={orderHandler}
                            >
                                Pay for the order
                            </Button>
                        </List.Item>
                    </List>
                </Col>
            </Row>
        </>
    );
};

export default UserCartDetailsPageComponent;
