import { Button, Form, Input, message, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { updateUserApiRequest, fetchUserDetail } from "../../redux/slicer/user/services";
import { setStatusIdle } from "../../redux/slicer/user/userSlicer";
import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import validations from "./profilpagevalidations";

const yupSync = {
    async validator({ field }, value) {
        await validations.validateSyncAt(field, { [field]: value });
    },
};

const UserProfilePage = () => {
    // const formRef = React.useRef(null);
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const { status, error, isLoading, userInfo, details } = useSelector((state) => state.user);

    useEffect(() => {
        if (userInfo?._id) {
            dispatch(fetchUserDetail(userInfo._id));
        }
    }, [dispatch, userInfo]);

    const onFinish = async (values) => {
        dispatch(updateUserApiRequest(values));
        messageApi.open({
            type: "success",
            content: "User profile successfully updated",
        });
        // formRef.current?.resetFields(["password"]);
    };

    if (error && status === "error") {
        messageApi.open({
            type: "error",
            content: error,
        });
    }

    if (status === "Update/success") {
        dispatch(setStatusIdle())
    }

    if (isLoading && status === "idle") {
        return (
            <Spin
                indicator={<LoadingOutlined spin className="!text-9xl text-gray-600 !w-10" />}
                className="flex justify-center items-center !h-screen"
            />
        );
    }

    return (
        <div className="flex flex-col w-[440px] lg:w-[600px] mx-auto justify-center py-4 px-5">
            {contextHolder}
            <h1 className="font-bold text-4xl">User Profile</h1>
            <Form
                // form={form}
                // ref={formRef}
                layout="vertical"
                name="register-form"
                onFinish={onFinish}
                className="mt-4"
                initialValues={{
                    name: userInfo.name,
                    lastName: userInfo.lastName,
                    email: `${userInfo.email} if you want to change email, remove account and create new one with new email address`,
                    phoneNumber: details.phoneNumber || "",
                    address: details.address || "",
                    country: details.country || "",
                    city: details.city || "",
                    state: details.state || "",
                    zipCode: details.zipCode || "",
                }}
            >
                <Form.Item name="name" label="Your Name" rules={[yupSync]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Your Last Name" rules={[yupSync]} hasFeedback>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email address">
                    <Input disabled className="!bg-gray-300 font-semibold " />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number" rules={[yupSync]} hasFeedback>
                    <Input addonBefore="+90" />
                </Form.Item>
                <Form.Item name="address" label="Address" rules={[yupSync]}>
                    <Input placeholder="Enter your street name and house number" />
                </Form.Item>
                <Form.Item name="country" label="Country" rules={[yupSync]}>
                    <Input placeholder="Enter your country" />
                </Form.Item>
                <Form.Item name="city" label="City" rules={[yupSync]}>
                    <Input placeholder="Enter your City" />
                </Form.Item>
                <Form.Item name="state" label="State" rules={[yupSync]}>
                    <Input placeholder="Enter your State" />
                </Form.Item>
                <Form.Item name="zipCode" label="Zip Code" rules={[yupSync]}>
                    <Input placeholder="Enter your Zip Code" />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[yupSync]} hasFeedback>
                    <Input.Password type="password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" className="w-24" size="middle" htmlType="submit" loading={isLoading}>
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserProfilePage;
