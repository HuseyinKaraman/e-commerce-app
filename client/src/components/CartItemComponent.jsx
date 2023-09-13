import { Alert, Button, Image, Popconfirm, Select, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const CartItemComponent = ({ dataSource, size, scrollY, orderCreated = false, changeCount = false,removeFromCartHandler,isProductId=true }) => {
    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            width: "20%",
            // responsive: ['md'],
            render: (image) => {
                return (
                    <Image
                        src={`${image ? image.path ?? null : null}`}
                        className="!min-w-[90px] !max-w-[200px]"
                        crossOrigin="anonymous"
                    />
                );
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: "20%",
        },
        {
            title: "Product Price",
            dataIndex: "price",
            key: "price",
            width: "15%",
            render: (text) => <p className="font-semibold">{text}$</p>,
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            width: "12%",
            render: (_, record) => (
                <Select
                    value={record.quantity}
                    className="sort-option rounded-full w-full"
                    size="middle"
                    disabled={orderCreated}
                    onChange={changeCount ? (e) => changeCount(record.productId, e) : undefined}
                >
                    {[...Array(record.count).keys()].map((x) => (
                        <Option key={x + 1} value={x + 1}>
                            {x + 1}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "action",
            dataIndex: "action",
            key: "action",
            width: "12%",
            render: (_, record) => (
                <Popconfirm
                    title="Delete product"
                    description="Are you sure to delete this product from cart?"
                    okText="Yes"
                    onConfirm={() => removeFromCartHandler(record.productId,record.quantity,record.price)}
                    cancelText="No"
                >
                    <Button
                        type="primary"
                        size="middle"
                        className="!flex justify-center items-center "
                        icon={<DeleteOutlined className="align-middle text-[18px]" />}
                        disabled={orderCreated}
                    ></Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            {dataSource.length === 0 ? (
                <Alert
                    message="Your Cart is empty"
                    type="info"
                    closable
                    className="mb-1 p-2 text-gray-500 font-semibold w-full my-2"
                />
            ) : (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    className="w-full mb-4"
                    showHeader={false}
                    pagination={false}
                    size={size ? size : "middle"}
                    scroll={{
                        y: scrollY ? scrollY : 700,
                    }}
                    rowKey={isProductId ? "productId" : "_id"}
                />
            )}
        </>
    );
};

export default CartItemComponent;
