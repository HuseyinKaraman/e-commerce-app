import CreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { uploadImageApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";
import { saveAttributeToCatDoc,newCategory,deleteCategory } from "../../redux/slicer/category/services";

const createProductApiRequest = async (formInputs) => {
    const res = await axios.post(`/api/products/admin`, { ...formInputs });
    return res;
};

const AdminCreateProductPage = () => {
    const dispatch = useDispatch();
    const { categories,message } = useSelector((state) => state.category);

    return (
        <CreateProductPageComponent
            categories={categories}
            resMessage={message}
            createProductApiRequest={createProductApiRequest}
            uploadImageApiRequest={uploadImageApiRequest}
            uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}
            saveAttributeToCatDoc={saveAttributeToCatDoc}
            newCategory={newCategory}
            deleteCategory={deleteCategory}
            dispatch={dispatch}
        />
    );
};

export default AdminCreateProductPage;
