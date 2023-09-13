import { Button, Cascader, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import validations from "../productvalidations";

const { Option } = Select;

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

// TODO : olmayan resimler eklenmeli ve hata veren resim sayfada gösterilmesin veya hatası css ile gösterilsin
const EditProductPageComponent = ({
    categories,
    fetchProduct,
    updateProductApiRequest,
    saveAttributeToCatDoc,
    imageDeleteHandler,
    uploadImageApiRequest,
    uploadImagesCloudinaryApiRequest,
    dispatch,
}) => {
    const formRef = React.useRef(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
    };
    // Todo : check newFileList or File and backend!
    const handleChange = ({ fileList: newFileList, file }) => {
        if (newFileList.length > 3) {
            messageApi.open({
                type: "warning",
                content: "Too Many files!",
            });
            return;
        }
        if (file?.status !== "error" && file?.status !== "removed") {
            if (process.env.REACT_APP_NODE_ENV !==  "production") {
                uploadImageApiRequest(file.originFileObj, id)
                    .then((data) => {
                        messageApi.open({
                            type: "success",
                            content: "Image Uploaded Successfully",
                        });
                    })
                    .catch((res) => {
                        messageApi.open({
                            type: "error",
                            content: res.response.data.message ? res.response.data.message : res.response.data,
                        });
                    });
            } else {
                try {
                    uploadImagesCloudinaryApiRequest(file, id);
                    messageApi.open({
                        type: "success",
                        content: "Image Uploaded Successfully",
                    });
                } catch (error) {
                    messageApi.open({
                        type: "error",
                        content: error.response.data.message ? error.response.data.message : error.response.data,
                    });
                }
            }
        }
    };
    const [categoryChoosen, setCategoryChoosen] = useState(null);
    const [product, setProduct] = useState({});
    const [productAttrs, setProductAttrs] = useState([]);
    const [mainAttrsFromDb, setMainAttrsFromDb] = useState([]);
    const [newAttrKey, setNewAttrKey] = useState(null);
    const [newAttrValue, setNewAttrValue] = useState(null);
    const { id } = useParams();

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const yupSync = {
        async validator({ field }, value) {
            await validations.validateSyncAt(field, { [field]: value });
        },
    };

    useEffect(() => {
        fetchProduct(id)
            .then((product) => {
                setProduct(product);
                setFileList(
                    product?.images
                        ? product.images.map((image) => {
                              return {
                                  uid: image._id,
                                  status: "done",
                                  url: image.path,
                              };
                          })
                        : []
                );
                setProductAttrs(
                    product?.attrs
                        ? product.attrs.map((attr) => {
                              return [attr.key, attr.value];
                          })
                        : []
                );
                setCategoryChoosen(product.category);
            })
            .catch((err) => console.log(err));
    }, [fetchProduct, id]);

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

    const onFinish = async (values) => {
        updateProductApiRequest(product._id, {
            name: values.name,
            description: values.description,
            category: values.category,
            price: values.price,
            count: values.count,
            attributes: values.attrs
        })
            .then((upRes) => {
                if (upRes.status === 200) {
                    messageApi.open({
                        type: "success",
                        content: "Product is updated Successfully",
                    });
                    setTimeout(() => navigate("/admin/products"), 2000);
                } else {
                    messageApi.open({
                        type: "error",
                        content: upRes.response.data.message ? upRes.response.data.message : upRes.response.data,
                    });
                }
            })
            .catch((err) => {
                messageApi.open({
                    type: "error",
                    content: err.message,
                });
            });
    };

    const addNewAttribute = () => {
        if (newAttrKey && newAttrValue) {
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

            dispatch(saveAttributeToCatDoc({ key: newAttrKey, val: newAttrValue, categoryChoosen }));
            formRef.current.setFieldValue("attrs", [...productAttrs, [newAttrKey, newAttrValue]]);

            setNewAttrKey(null);
            setNewAttrValue(null);
        } else {
            messageApi.open({
                type: "error",
                content: "Two fields are required",
            });
        }
    };

    if (Object.keys(product).length === 0) {
        return <Spin tip="Loading..." className="absolute h-full top-[50%] right-[50%]" />;
    }

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
                <h1 className="font-bold text-4xl">Edit product</h1>
                <Form
                    layout="vertical"
                    name="register-form"
                    ref={formRef}
                    onFinish={onFinish}
                    className="mt-4"
                    initialValues={{
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        price: product.price,
                        count: product.count,
                        attrs: productAttrs,
                        images: fileList,
                    }}
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
                    <Form.Item name="category" label="Category">
                        <Select
                            placeholder="Please choose Category"
                            onChange={(e) => {
                                setCategoryChoosen(e);
                                formRef.current.setFieldValue("attrs", []);
                            }}
                            value={categoryChoosen}
                        >
                            <Option value="">Choose Category</Option>
                            {Array.isArray(categories) &&
                                categories.map((category, idx) => (
                                    <Option value={category.name} key={idx}>
                                        {category.name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={`${
                            mainAttrsFromDb.length > 0 ? "Choose atrribute And set key" : "Category have not attribute"
                        }`}
                        name="attrs"
                    >
                        <Cascader
                            disabled={!(mainAttrsFromDb.length !== 0)}
                            options={mainAttrsFromDb}
                            placeholder="Please select"
                            multiple
                            showCheckedStrategy={Cascader.SHOW_CHILD}
                        />
                    </Form.Item>
                    <Row className="my-4 justify-between">
                        <Col sm={24} className="mb-4">
                            Add New Attribute Key-Value
                        </Col>
                        <Col sm={9} className="mb-4">
                            <Input
                                placeholder="Attribute Key"
                                value={newAttrKey}
                                onChange={(e) => setNewAttrKey(e.target.value)}
                            />
                        </Col>
                        <Col sm={9} className="mb-4">
                            <Input
                                placeholder="Attribute value"
                                value={newAttrValue}
                                onChange={(e) => setNewAttrValue(e.target.value)}
                            />
                        </Col>
                        <Col sm={4} className="mb-4">
                            <Button type="dashed" onClick={addNewAttribute} block icon={<PlusOutlined />} />
                        </Col>
                    </Row>
                    <Form.Item name="images" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload
                            name="logo"
                            id="id"
                            // action="/upload.do"
                            listType="picture-circle"
                            multiple
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={(e) => {
                                if (e.url) {
                                    imageDeleteHandler(e.url, product._id)
                                        .then(() => {
                                            messageApi.open({
                                                type: "info",
                                                content: "Image is removed",
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
                            }}
                            beforeUpload={(e) => false} // return false so that antd doesn't upload the picture right away
                        >
                            <div>
                                <UploadOutlined />
                                <div className="mt-2">Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" className="w-24" size="middle" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: "100%",
                    }}
                    crossOrigin="anonymous"
                    src={previewImage}
                />
            </Modal>
        </Row>
    );
};

export default EditProductPageComponent;
