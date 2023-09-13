import { Alert, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AddedToCartMessageComponent = () => {
    const navigate = useNavigate();
    const status = useSelector((state) => state.cart.status);

    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            {status === "success" && (
                <Alert
                    message={<span className="text-green-600 font-semibold">The Product was added to your cart</span>}
                    description={
                        <>
                            <Button type="primary" className="!bg-green-600" onClick={goBack}>
                                Go BACK
                            </Button>{" "}
                            <Link to="/cart">
                                <Button type="primary" danger>
                                    Go to cart
                                </Button>
                            </Link>
                        </>
                    }
                    showIcon
                    type="success"
                    closable
                />
            )}
        </>
    );
};

export default AddedToCartMessageComponent;
