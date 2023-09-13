import ProductDetailsPageComponent from "./components/ProductDetailsPageComponent";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slicer/cart/services";
import { setStatusIdle } from "../redux/slicer/cart/cartSlicer";
import axios from "axios";

const getProductDetails = async (id) => {
    const { data } = await axios.get(`/api/products/get-one/${id}`);
    return data;
};

const writeReviewApiRequest = async (productId,formInputs) => { 
    const { data } = await axios.post(`/api/users/review/${productId}`,{
        ...formInputs
    });
    return data;
}


const ProductDetailsPage = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.user);

    return (
        <ProductDetailsPageComponent
            addToCart={addToCart}
            getProductDetails={getProductDetails}
            writeReviewApiRequest={writeReviewApiRequest}
            setStatusIdle={setStatusIdle}
            userInfo={userInfo}
            dispatch={dispatch}
        />
    );
};

export default ProductDetailsPage;
