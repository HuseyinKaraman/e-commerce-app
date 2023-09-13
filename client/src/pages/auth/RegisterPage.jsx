import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { registerUserApiRequest } from "../../redux/slicer/user/services";
import { setStatusIdle } from "../../redux/slicer/user/userSlicer";
import validations from "./registervalidation";

const yupSync = {
    async validator({ field, password }, value) {
        await validations.validateSyncAt(field, { [field]: value });
    },
};

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const status = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);
    const isLoading = useSelector((state) => state.user.isLoading);
    const userInfo = useSelector((state) => state.user.userInfo);

    const onFinish = async (values) => {
        dispatch(registerUserApiRequest(values));
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
        window.location.href = "/user";
    }

    return (
        <>
            {contextHolder}
            <div className="flex flex-col w-[440px] lg:w-[600px] mx-auto justify-center py-16 px-5">
                <h1 className="font-bold text-4xl">REGISTER</h1>
                <Form layout="vertical" name="register-form" onFinish={onFinish} className="mt-8">
                    <Form.Item name={"name"} label="Your Name" rules={[yupSync]} hasFeedback>
                        <Input placeholder="Enter your name" />
                    </Form.Item>
                    <Form.Item name={"lastName"} label="Your Last Name" rules={[yupSync]} hasFeedback>
                        <Input placeholder="Enter your last name" />
                    </Form.Item>
                    <Form.Item name={"email"} label="Email address" rules={[yupSync]} hasFeedback>
                        <Input type="email" placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item name={"password"} label="Password" rules={[yupSync]} hasFeedback>
                        <Input.Password type="password" />
                    </Form.Item>
                    <Form.Item
                        name={"passwordConfirm"}
                        label="Repeat Password"
                        hasFeedback
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Repeat Password is required!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Both password should match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password type="password" />
                    </Form.Item>
                    <div className="flex w-full my-3">
                        Do you have an account already?{" "}
                        <Link className="text-blue-600" to="/login">
                            Login
                        </Link>
                    </div>
                    <Form.Item>
                        <Button type="primary" className="w-24" size="middle" htmlType="submit" loading={isLoading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default RegisterPage;
