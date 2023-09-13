import { Alert, Button, Carousel, Col, Form, Image, Input, List, Rate, Row, Select, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
import MetaComponent from "../../components/MetaComponent";

const { Option } = Select;

const ProductDetailsPageComponent = ({
    addToCart,
    getProductDetails,
    writeReviewApiRequest,
    setStatusIdle,
    userInfo,
    dispatch,
}) => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState([]);
    const [productReviewed, setProductReviewed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const messageEndRef = useRef();

    /* eslint-disable no-template-curly-in-string */
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not a valid email!",
            number: "${label} is not a valid number!",
        },
        number: {
            range: "${label} must be between ${min} and ${max}",
        },
    };
    /* eslint-enable  no-template-curly-in-string */

    useEffect(() => {
        if (productReviewed) {
            setTimeout(() => {
                messageEndRef.current.scrollIntoView({ behavior: "smooth" });
            }, 200);
        }
    }, [productReviewed]);

    useEffect(() => {
        getProductDetails(id)
            .then((data) => {
                setProduct(data);
                setLoading(false);
                if (productReviewed) setProductReviewed(false);
            })
            .catch((err) => {
                // setError(err.response.data.message ? err.response.data.message : err.response.data);
                setError(true);
                setLoading(false);
            });
    }, [getProductDetails, id, productReviewed]);

    const onFinish = (values) => {
        setLoading(true);
        writeReviewApiRequest(id, {
            comment: values.comment,
            rating: values.rating,
        })
            .then(() => {
                setProductReviewed(true);
            })
            .catch((err) => {
                setLoading(false);
                setError(err.response.data.message ? err.response.data.message : err.response.data);
            });
    };

    const addToCartHandler = (id) => {
        dispatch(addToCart({ id, quantity }));
        setTimeout(() => dispatch(setStatusIdle()), 10000);
    };

    return loading ? (
        <Spin tip="Loading detail..." className="flex justify-center items-center w-full h-[80vh]" />
    ) : error ? (
        <h1>Error while loading products.Try again later!</h1>
    ) : (
        <>
            <MetaComponent title={product.name} description={product.description} />
            <div className="md:px-2 px-1">
                <AddedToCartMessageComponent />
                <Row className="mt-5 ">
                    <Col className="px-3 md:w-1/3 z-10">
                        {product?.images ? (
                            <Carousel dotPosition="bottom" className="w-full mb-5">
                                {product.images.map((image) => (
                                    <Image src={image.path ?? null} key={image._id} crossOrigin="anonymous" />
                                ))}
                            </Carousel>
                        ) : null}
                    </Col>
                    <Col className="flex-1 md:w-2/3">
                        <Row>
                            <Col className="px-3 flex-1">
                                <List>
                                    <List.Item>
                                        <h1 className="text-2xl font-semibold">{product?.name}</h1>
                                    </List.Item>
                                    <List.Item>
                                        <Rate disabled defaultValue={product?.rating} className="text-[16px] mr-1" /> (
                                        {product.reviewsNumber})
                                    </List.Item>
                                    <List.Item className="text-lg">
                                        Price:<span className="ml-1 font-bold">{product?.price}$</span>
                                    </List.Item>
                                    <List.Item>{product?.description}</List.Item>
                                </List>
                            </Col>
                            <Col className="lg:px-2 md:w-1/3 w-[35%]">
                                <List bordered className="product-detail__status max-w-[200px] mx-auto" split={false}>
                                    <List.Item>Status: {product?.count > 0 ? "in stock" : "out of stock"}</List.Item>
                                    <List.Item>
                                        Price:<span className="ml-1 font-bold">{product?.price}$</span>
                                    </List.Item>
                                    <List.Item>
                                        Quantity: <br />
                                        <Select
                                            value={quantity}
                                            className="sort-option rounded-full border-l-0 w-1/2"
                                            size="middle"
                                            onChange={(e) => setQuantity(e)}
                                        >
                                            {[...Array(product.count).keys()].map((value) => (
                                                <Option value={value + 1} key={value + 1}>
                                                    {value + 1}
                                                </Option>
                                            ))}
                                        </Select>
                                    </List.Item>
                                    <List.Item>
                                        <Button type="primary" danger onClick={() => addToCartHandler(id)}>
                                            Add To cart
                                        </Button>
                                    </List.Item>
                                </List>
                            </Col>
                        </Row>
                        <Row className="px-3 mt-52 md:w-[620px]">
                            <Col span={24}>
                                <h5 className="font-semibold text-xl">REVIEWS</h5>
                                <hr />
                                <List className="mb-5">
                                    {product?.reviews &&
                                        product?.reviews.map((review) => (
                                            <List.Item key={review._id}>
                                                {review.user.name} <br />
                                                <Rate
                                                    disabled
                                                    defaultValue={review.rating}
                                                    className="text-[16px] mr-1"
                                                />
                                                <br />
                                                {review.createdAt.substring(0, 10)} <br />
                                                <p>{review.comment}</p>
                                            </List.Item>
                                        ))}
                                    <div ref={messageEndRef} />
                                </List>

                                {!userInfo.name && (
                                    <Alert
                                        message="Login first to write a review"
                                        type="error"
                                        closable
                                        className="my-2 text-red-600 font-semibold"
                                    />
                                )}
                                <Form
                                    className="mt-3"
                                    name="reviews-form"
                                    onFinish={onFinish}
                                    layout="vertical"
                                    validateMessages={validateMessages}
                                    initialValues={{
                                        rating: "",
                                    }}
                                >
                                    <Form.Item
                                        name={"comment"}
                                        label="Review"
                                        rules={[
                                            {
                                                required: true,
                                                min: 5,
                                            },
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={5}
                                            className="!resize-none"
                                            placeholder="Write you reviews"
                                            disabled={!userInfo.name}
                                        />
                                    </Form.Item>
                                    <Form.Item name="rating" label="Rating">
                                        <Select placeholder="Please Rating Product" required disabled={!userInfo.name}>
                                            <Option value="">Your Rating</Option>
                                            <Option value="5">5 (very good)</Option>
                                            <Option value="4">4 (good)</Option>
                                            <Option value="3">3 (average)</Option>
                                            <Option value="2">2 (bad)</Option>
                                            <Option value="1">1 (awful)</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item className="">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="w-full"
                                            size="large"
                                            disabled={!userInfo.name}
                                        >
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ProductDetailsPageComponent;
