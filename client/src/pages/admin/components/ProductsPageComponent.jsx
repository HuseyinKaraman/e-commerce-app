import { CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Button, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";

const ProductsPageComponent = ({ fetchProducts, deleteProduct }) => {
    const [products, setProducts] = useState([]);
    const [productDeleted, setProductDeleted] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const columns = [
        {
            title: "#",
            dataIndex: "key",
            key: "key",
            width: "2%",
            responsive: ["sm"],
        },
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
            width: "5%",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            width: "3%",
            render: (text) => <p className="font-semibold">${text}</p>,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: "5%",
        },
        {
            title: "Edit/Delete",
            width: "3%",
            render: (_, record) => {
                return (
                    <div>
                        <div key={record._id}>
                            <Link to={`/admin/edit-product/${record._id}`}>
                                <Button type="primary" size="small" className="inline-flex justify-center items-center">
                                    <EditOutlined />
                                </Button>
                            </Link>
                            {" / "}
                            <Popconfirm
                                title="Delete the product"
                                description="Are you sure to delete this product?"
                                okText="Yes"
                                onConfirm={() => deleteHandler(record._id)}
                                cancelText="No"
                            >
                                <Button
                                    type="primary"
                                    danger
                                    size="small"
                                    className="inline-flex justify-center items-center"
                                >
                                    <CloseCircleOutlined />
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>
                );
            },
        },
    ];

    const deleteHandler = async (productId) => {
        deleteProduct(productId).then((res) => {
            if (res.status === 200) {
                   messageApi.open({
                       type: "success",
                       content: res.data,
                   });
                setProductDeleted(!productDeleted);
            }
        });
    };

    useEffect(() => {
        const abctrl = new AbortController();
        fetchProducts(abctrl)
            .then((res) => {
                setProducts(
                    res.data.map((product, index) => {
                        return { key: index + 1, ...product };
                    })
                );
            })
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.response.data.message ? err.response.data.message : err.response.data,
                });
            });

        return () => abctrl.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productDeleted]);

    return (
        <>
            {contextHolder}
            <Row className="w-full md:mt-10">
                <Col className="md:w-1/5 w-full">
                    <AdminLinksComponent />
                </Col>
                <Col className="md:w-3/4 w-full mx-auto px-2">
                    <div className="md:mb-4 mb-2">
                        <span className="text-3xl font-bold mr-2">Product List</span>
                        <Link to="/admin/create-new-product" className="!align-super">
                            <Button type="primary" size="large" className="!text-lg !px-2 !bg-cyan-500">
                                Create new
                            </Button>
                        </Link>
                    </div>
                    <Table
                        dataSource={products}
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

export default ProductsPageComponent;
