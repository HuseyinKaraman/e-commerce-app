import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Row, Col, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

const OrdersPageComponent = ({ fetchOrders }) => {
    const [orders, setOrders] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const abctrl = new AbortController();
        fetchOrders(abctrl)
            .then((res) => {
                res = res.map((order, index) => {
                    return { key: index + 1, ...order };
                });
                setOrders(res);
            })
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.response.data.message ? err.response.data.message : err.response.data,
                });
            });
        return () => abctrl.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            title: "#",
            dataIndex: "key",
            key: "key",
            width: "5%",
            responsive: ["sm"],
        },
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            width: "5%",
            render: (text) => <p className="font-semibold">{text!== null ? (<>{text.name} {text.lastName}</>): "null" }</p>,
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: "8%",
            render: (text) => <p className="font-semibold">{text.substring(0, 10)}</p>,
        },
        {
            title: "Total",
            dataIndex: "orderTotal",
            key: "orderTotal",
            width: "8%",
            render: (text) => <p className="font-semibold">{text.cartSubTotal}$</p>,
        },
        {
            title: "Delivered",
            dataIndex: "isDelivered",
            key: "isDelivered",
            width: "4%",
            render: (_, record) => {
                return (
                    <div className="!p-0 !m-0 !w-full">
                        {record.isDelivered ? (
                            <CheckOutlined className="text-green-600" />
                        ) : (
                            <CloseOutlined className="text-red-600" />
                        )}
                    </div>
                );
            },
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            width: "4%",
            render: (text) => <p className="font-semibold">{text==='cod' ? "Cash On Delivery" : (text==="pp"?"PayPal" :"Credit Card")}</p>,
        },
        {
            title: "Order Details",
            dataIndex: "details",
            key: "details",
            width: "8%",
            render: (_, record) => (
                <Link to={`/admin/order-details/${record._id}`} className="text-blue-500 ">
                    go to order
                </Link>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <Row className="w-full md:mt-10">
                <Col className="md:w-1/5 w-full">
                    <AdminLinksComponent />
                </Col>
                <Col className="md:w-3/4 w-full mx-auto md:mt-0 mt-2">
                    <h1 className="text-3xl my-4 font-bold">Orders</h1>
                    <Table
                        dataSource={orders}
                        columns={columns}
                        className="order-details__table w-full sm:px-4"
                        pagination={false}
                        size="small"
                    />
                </Col>
            </Row>
        </>
    );
};

export default OrdersPageComponent;
