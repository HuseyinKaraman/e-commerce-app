import EditProductPageComponent from "./components/EditProductPageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { uploadImageApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";
import { saveAttributeToCatDoc } from "../../redux/slicer/category/services";

const fetchProduct = async (productId) => {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    return data;
};

const updateProduct = async (productId, formInputs) => {
    const res = await axios.put(`/api/products/admin/${productId}`, { ...formInputs });
    return res;
};

const imageDeleteHandler = async (imagePath, productId) => {
    let encoded = encodeURIComponent(imagePath);
    if (process.env.REACT_APP_NODE_ENV !== "production") {
        await axios.delete(`/api/products/admin/image/${encoded}/${productId}`);
    }else{
        await axios.delete(`/api/products/admin/image/${encoded}/${productId}?cloudinary=true`);
    }
};


const AdminEditProductPage = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);

    return (
        <EditProductPageComponent
            categories={categories}
            fetchProduct={fetchProduct}
            updateProductApiRequest={updateProduct}
            saveAttributeToCatDoc={saveAttributeToCatDoc}
            imageDeleteHandler={imageDeleteHandler}
            uploadImageApiRequest={uploadImageApiRequest}
            uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}
            dispatch={dispatch}
        />
    );
};

export default AdminEditProductPage;
