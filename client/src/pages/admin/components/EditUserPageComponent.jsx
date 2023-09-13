import { Button, Checkbox, Col, Form, Input, Row, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: "${label} is required!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
};
/* eslint-enable no-template-curly-in-string */

const EditUserPageComponent = ({ fetchUser, updateUserApiRequest }) => {
    const { id } = useParams();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser(id)
            .then((data) => {
                setUser(data);
            })
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.response.data.message ? err.response.data.message : err.response.data,
                });
            });
    }, [fetchUser, id, messageApi]);

    const onFinish = async (values) => {
        updateUserApiRequest(id, values)
            .then((data) => {
                if (data === "user updated") {
                    messageApi.open({
                        type: "success",
                        content: "Successfully updated user!",
                    });
                    setTimeout(()=>{
                        navigate("/admin/users");
                    },1500);
                }
            }
            )
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.response.data.message ? err.response.data.message : err.response.data,
                });
            });
    };

    if (!user) {
        return <Spin tip="User Loading..." className="flex justify-center items-center w-full h-[80vh]" />;
    }

    return (
        <Row className="px-4 flex-col sm:flex-row justify-center mt-5 gap-y-1 gap-x-2">
            {contextHolder}
            <Col className="w-[100px] sm:mt-2">
                <Link to="/admin/users">
                    <Button size="large" type="primary" className="!bg-cyan-500">
                        Go Back
                    </Button>
                </Link>
            </Col>
            <Col className="flex-grow max-w-[600px] max-sm:mt-5">
                <h1 className="font-bold text-4xl">Edit user</h1>
                <Form
                    layout="vertical"
                    name="edit-user"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                    className="mt-4"
                    initialValues={{
                        name: user?.name || "",
                        lastName: user?.lastName || "",
                        email: user?.email || "",
                        isAdmin: user?.isAdmin || false,
                    }}
                >
                    <Form.Item name="name" label="First Name" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="LastName" rules={[{ required: true }]} hasFeedback>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]} hasFeedback>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item name="isAdmin" valuePropName="checked">
                        <Checkbox>
                            {" "}
                            <label className="cursor-pointer !align-sub" htmlFor="edit-user_isAdmin">
                                Is admin
                            </label>
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="w-24" size="middle" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default EditUserPageComponent;
