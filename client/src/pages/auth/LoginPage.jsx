import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { loginUserApiRequest } from "../../redux/slicer/user/services";
import { setStatusIdle } from "../../redux/slicer/user/userSlicer";
import { useEffect } from "react";
import validations from "./loginvalidation";

const yupSync = {
    async validator({ field }, value) {
        await validations.validateSyncAt(field, { [field]: value });
    },
};

const LoginPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage();
    const status = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);
    const isLoading = useSelector((state) => state.user.isLoading);
    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        if (location.state !== null) {
            messageApi.open({
                type: "error",
                content: location.state.content,
            });
        }
    }, [location.state, messageApi]);

    const onFinish = (values) => {
        dispatch(loginUserApiRequest(values));
    };

    if (error && status === "error") {
        messageApi.open({
            type: "error",
            content: error,
        });
        dispatch(setStatusIdle());
    }

    if (Object.keys(userInfo).length !==0 && status === "success") {
        dispatch(setStatusIdle());
        if (!userInfo.isAdmin) {
            return <Navigate to="/user"/>
        } else {
            return <Navigate to="/admin/orders"/>
        }
    }

    return (
        <div className="flex flex-col w-[440px] lg:w-[600px] mx-auto justify-center py-16 px-5">
            {contextHolder}
            <h1 className="font-bold text-4xl">LOGIN</h1>
            <Form
                layout="vertical"
                name="register-form"
                className="mt-8"
                initialValues={{ doNotLogout: false }}
                onFinish={onFinish}
            >
                <Form.Item name={"email"} label="Email address" rules={[yupSync]} hasFeedback>
                    <Input type="email" placeholder="Enter your email" />
                </Form.Item>
                <Form.Item name={"password"} label="Password" rules={[yupSync]} hasFeedback>
                    <Input.Password type="password" />
                </Form.Item>
                <Form.Item name="doNotLogout" valuePropName="checked">
                    <Checkbox>Do not logout</Checkbox>
                </Form.Item>
                <div className="flex w-full my-3">
                    Don't you have an account?{" "}
                    <Link className="text-blue-600" to="/register">
                        Register
                    </Link>
                </div>
                <Form.Item>
                    <Button type="primary" className="w-24" size="middle" htmlType="submit" loading={isLoading}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;
