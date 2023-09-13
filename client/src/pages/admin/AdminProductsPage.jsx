import ProductsPageComponent from "./components/ProductsPageComponent";

import axios from "axios";

const fetchProducts = async (abctrl) => {
    const res = await axios.get("/api/products/admin", {
        signal: abctrl.signal,
    });

    return res;
};

const deleteProduct = async (productId) => {
    const res = await axios.delete(`/api/products/admin/${productId}`);
    return res;
};

const AdminProductsPage = () => {
  return (
    <>
      <ProductsPageComponent fetchProducts={fetchProducts} deleteProduct={deleteProduct}/>
    </>
  );
};

export default AdminProductsPage;
