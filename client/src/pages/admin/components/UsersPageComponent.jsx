import { CheckOutlined, CloseCircleOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Row, Col, Table, Button, message, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useEffect, useState } from "react";

const UsersPageComponent = ({ fetchUserDetails, deleteUser }) => {
    const [users, setUsers] = useState([]);
    const [userDeleted, setUserDeleted] = useState(false);
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: "5%",
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastname",
            width: "5%",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: "3%",
        },
        {
            title: "Is Admin",
            dataIndex: "isAdmin",
            key: "isAdmin",
            width: "4%",
            render: (_, record) => {
                return (
                    <div className="!p-0 !m-0 !w-full">
                        {record.isAdmin ? (
                            <CheckOutlined className="text-green-600" />
                        ) : (
                            <CloseOutlined className="text-red-600" />
                        )}
                    </div>
                );
            },
        },
        {
            title: "Edit/Delete",
            width: "3%",
            render: (_, record) => {
                return (
                    <div key={record.key}>
                        <Link to={`/admin/edit-user/${record._id}`}>
                            <Button type="primary" size="small" className="inline-flex justify-center items-center">
                                <EditOutlined />
                            </Button>
                        </Link>
                        {" / "}
                        <Popconfirm
                            title="Delete the user"
                            description="Are you sure to delete this user?"
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
                );
            },
        },
    ];

    const deleteHandler = async (userId) => {
       deleteUser(userId).then((res) => {
        if (res.status === 200) {
               messageApi.open({
                   type: "success",
                   content: res.data,
               });
               setUserDeleted(!userDeleted)
        }
    });
    };

    useEffect(() => {
        const abctrl = new AbortController();
        fetchUserDetails(abctrl)
            .then((res) => {
                res = res.map((user, index) => {return {key: index + 1,...user}});
                setUsers(res);
            })
            .catch((err) => messageApi.open({
                type: "success",
                content: err.response.data.message ? err.response.data.message : err.response.data,
            }));
        return () => abctrl.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userDeleted]);

    return (
        <>
            {contextHolder}
            <Row className="w-full md:mt-10">
                <Col className="md:w-1/5 w-full">
                    <AdminLinksComponent />
                </Col>
                <Col className="md:w-3/4 w-full mx-auto px-2">
                    <div className="md:mb-4 mb-2">
                        <span className="text-3xl font-bold mr-2">User List</span>
                    </div>
                    <Table
                        dataSource={users}
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

export default UsersPageComponent;
