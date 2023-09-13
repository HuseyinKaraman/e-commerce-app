import { Button, Cascader, Col, Form, Input, InputNumber, Popconfirm, Row, Select, Upload, message } from "antd";
import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import validations from "../productvalidations";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const CreateProductPageComponent = ({
    categories,
    createProductApiRequest,
    uploadImageApiRequest,
    uploadImagesCloudinaryApiRequest,
    saveAttributeToCatDoc,
    newCategory,
    deleteCategory,
    dispatch,
}) => {
    const formRef = React.useRef(null);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [mainAttrsFromDb, setMainAttrsFromDb] = useState([]);
    const [categoryChoosen, setCategoryChoosen] = useState("");
    const [newAttrKey, setNewAttrKey] = useState(null);
    const [newAttrValue, setNewAttrValue] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState(null);

    useEffect(() => {
        let mainCategoryOfEditedProductAllData = Array.isArray(categories)
            ? categories.find((item) => item.name === categoryChoosen?.split("/")[0])
            : false;
        let mainAttrs = [];
        if (mainCategoryOfEditedProductAllData && mainCategoryOfEditedProductAllData.attrs.length > 0) {
            mainAttrs = mainCategoryOfEditedProductAllData.attrs.map((attr) => ({
                key: attr._id,
                label: attr.key,
                value: attr.key,
                children: attr.value.map((attrValue, idx) => ({
                    label: attrValue,
                    value: attrValue,
                    key: attr._id + idx,
                })),
            }));
        }
        setMainAttrsFromDb(mainAttrs);
    }, [categories, categoryChoosen]);

    const handleChange = ({ fileList: newFileList, file }) => {
        if (file?.status !== "error") {
            setFileList(newFileList);
            console.log(newFileList);
        }
    };

    const onFinish = async (values) => {
        if (fileList.length > 3) {
            messageApi.open({
                type: "warning",
                content: "Too Many files!",
            });
            return;
        } else {
            createProductApiRequest({
                name: values.name,
                description: values.description,
                category: values.category,
                price: values.price,
                count: values.count,
                attributes: values.attrs || [],
            })
                .then((upRes) => {
                    if (process.env.REACT_APP_NODE_ENV !== "production") {
                        if (fileList.length !== 0 && upRes.status === 200) {
                            uploadImageApiRequest(fileList, upRes.data.productId)
                                .then(() => {
                                    messageApi.open({
                                        type: "success",
                                        content: "Image Uploaded Successfully",
                                    });
                                })
                                .catch((res) => {
                                    messageApi.open({
                                        type: "error",
                                        content: res.response.data.message
                                            ? res.response.data.message
                                            : res.response.data,
                                    });
                                });
                        }
                    } else {
                        console.log(fileList)
                        if (fileList.length !== 0 && upRes.status === 200) {
                            uploadImagesCloudinaryApiRequest(fileList, upRes.data.productId);
                        }
                    }
                    return upRes;
                })
                .then((res) => {
                    if (res.status === 200) {
                        messageApi.open({
                            type: "success",
                            content: "Product is created",
                        });
                        setTimeout(() => navigate("/admin/products"), 1500);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const addNewAttribute = () => {
        if (newAttrKey && newAttrValue && categoryChoosen) {
            let isLabelAlreadyExist = mainAttrsFromDb.find((option) => option.label === newAttrKey);

            if (isLabelAlreadyExist) {
                const isValueAlreadyExits = isLabelAlreadyExist.children.find((child) => child.label === newAttrValue);

                if (isValueAlreadyExits) {
                    return messageApi.open({
                        type: "info",
                        content: "Attribute key value pair already exist",
                    });
                }
            }

            let attrs = formRef.current.getFieldValue("attrs") || [];
            dispatch(saveAttributeToCatDoc({ key: newAttrKey, val: newAttrValue, categoryChoosen }));
            formRef.current.setFieldValue("attrs", [...attrs, [newAttrKey, newAttrValue]]);

            setNewAttrKey(null);
            setNewAttrValue(null);
        } else if (!categoryChoosen) {
            messageApi.open({
                type: "error",
                content: "Choose a category",
            });
        } else {
            messageApi.open({
                type: "error",
                content: "Two fields are required",
            });
        }
    };

    const newCategoryHandler = () => {
        if (newCategoryName) {
            dispatch(newCategory(newCategoryName));
            formRef.current.setFieldValue("category", newCategoryName);
            setCategoryChoosen(newCategoryName);
            setNewCategoryName(null);
        }
    };

    const deleteCategoryHandler = () => {
        if (categoryChoosen !== "") {
            dispatch(deleteCategory(categoryChoosen));
            setCategoryChoosen("");
            formRef.current.setFieldValue("category", "");
        } else {
            messageApi.open({
                type: "warning",
                content: "Select a category!",
            });
        }
    };

    const yupSync = {
        async validator({ field }, value) {
            await validations.validateSyncAt(field, { [field]: value });
        },
    };

    return (
        <Row className="px-4 flex-col sm:flex-row justify-center mt-5 gap-y-1 gap-x-2">
            {contextHolder}
            <Col className="w-[100px] sm:mt-2">
                <Link to="/admin/products">
                    <Button size="large" type="primary" className="!bg-cyan-500">
                        Go Back
                    </Button>
                </Link>
            </Col>
            <Col className="flex-grow max-w-[600px]">
                <h1 className="font-bold text-4xl">Create a new product</h1>
                <Form
                    ref={formRef}
                    layout="vertical"
                    name="register-form"
                    onFinish={onFinish}
                    className="mt-4"
                    initialValues={{ category: "" }}
                >
                    <Form.Item name="name" label="Product Name" hasFeedback rules={[yupSync]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[yupSync]}>
                        <Input.TextArea rows={4} className="!resize-none" placeholder="Write you reviews" />
                    </Form.Item>
                    <Form.Item name="count" label="Count in stock" hasFeedback rules={[yupSync]}>
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item name="price" label="Price" hasFeedback rules={[yupSync]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label={
                            <>
                                <span className="mt-auto">Category</span>
                                <Popconfirm
                                    title="Delete the user"
                                    description="Are you sure to delete this category?"
                                    okText="Yes"
                                    onConfirm={deleteCategoryHandler}
                                    cancelText="No"
                                >
                                    <Button
                                        type="ghost"
                                        danger
                                        size="small"
                                        className="inline-flex justify-center items-center"
                                    >
                                        <CloseOutlined className="ml-1 !text-lg cursor-pointer" />
                                    </Button>
                                    <small className="mt-auto">(remove selected)</small>
                                </Popconfirm>
                            </>
                        }
                    >
                        <Select onChange={setCategoryChoosen}>
                            <Option value="">Choose Category</Option>
                            {Array.isArray(categories) &&
                                categories.map((category, idx) => (
                                    <Option value={category.name} key={idx}>
                                        {category.name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Row className="my-4 justify-between">
                        <Col xs={24} className="mb-4">
                            Or create new category (e.g. Computers/Laptops/Intel)
                        </Col>
                        <Col xs={18}>
                            <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                        </Col>
                        <Col xs={4} className="mb-4">
                            <Button
                                type="dashed"
                                onClick={newCategoryHandler}
                                icon={<PlusOutlined />}
                                className="w-full"
                                block
                            />
                        </Col>
                    </Row>
                    <Form.Item
                        name="attrs"
                        label={`${
                            mainAttrsFromDb?.length > 0 ? "Choose atrribute And set key" : "Category have not attribute"
                        }`}
                    >
                        <Cascader
                            options={mainAttrsFromDb}
                            placeholder="Please select"
                            multiple
                            showCheckedStrategy={Cascader.SHOW_CHILD}
                            disabled={!categoryChoosen}
                        />
                    </Form.Item>
                    <Row className="my-4 justify-between">
                        <Col xs={24} className="mb-4">
                            Add New Attribute Key-Value
                        </Col>
                        <Col sm={9} className="mb-4">
                            <Input
                                placeholder="Attribute Key"
                                value={newAttrKey}
                                disabled={!categoryChoosen}
                                onChange={(e) => setNewAttrKey(e.target.value)}
                            />
                        </Col>
                        <Col sm={9} className="mb-4">
                            <Input
                                placeholder="Attribute value"
                                value={newAttrValue}
                                disabled={!categoryChoosen}
                                onChange={(e) => setNewAttrValue(e.target.value)}
                            />
                        </Col>
                        <Col xs={4} className="mb-4">
                            <Button
                                type="dashed"
                                onClick={addNewAttribute}
                                block
                                icon={<PlusOutlined />}
                                disabled={!categoryChoosen}
                            />
                        </Col>
                    </Row>
                    <Form.Item name="upload" label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            name="logo"
                            multiple
                            listType="picture-card"
                            beforeUpload={() => false}
                            onChange={handleChange}
                        >
                            <div>
                                <UploadOutlined />
                                <div className="mt-4">Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="w-24" size="middle" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default CreateProductPageComponent;
