import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Row, Col, Table, Alert } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

let index = 1;

const UserOrdersPageComponent = ({ getOrders }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders()
            .then((orders) => {
                setOrders(orders);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [getOrders]);

    const columns = [
        {
            title: "#",
            width: "5%",
            responsive: ["sm"],
            render: () => {
                if (index > orders.length - 1) {
                    index = 1;
                    return <p className="font-semibold">{orders.length}</p>;
                } else {
                    return <p className="font-semibold">{index++}</p>;
                }
            },
        },
        {
            title: "User",
            width: "5%",
            render: (text) => <p>You</p>,
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
            dataIndex: "total",
            key: "total",
            width: "8%",
            render: (_, record) => <p className="font-semibold">{record.orderTotal.cartSubTotal}$</p>,
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
            title: "Order Details",
            dataIndex: "details",
            key: "details",
            width: "8%",
            render: (_, record) => (
                <Link to={`/user/order-details/${record._id}`} className="text-blue-500 ">
                    go to order
                </Link>
            ),
        },
    ];

    return (
        <>
            <Row className="w-full">
                <Col className="sm:w-4/5 w-full sm:mx-auto">
                    <h1 className="text-3xl my-4 font-bold">My Orders</h1>
                    {orders.length !== 0 ? (
                        <Table
                            dataSource={orders}
                            columns={columns}
                            rowKey="_id"
                            className="order-details__table w-full pr-1 pl-1"
                            pagination={false}
                            size="small"
                        />
                    ) : (
                        <Alert
                            message="You don't have an order"
                            type="info"
                            closable
                            className="mb-1 text-gray-500 font-semibold"
                        />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default UserOrdersPageComponent;
