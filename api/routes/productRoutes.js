const router = require("express").Router();
const {
    getProducts,
    getProductById,
    getBestSellers,
    adminGetProducts,
    adminDeleteProduct,
    adminCreateProduct,
    adminUpdateProduct,
    adminUpload,
    adminDeleteProductImage,
} = require("../controllers/productController");

const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");

router.get("/category/:categoryName/search/:searchQuery", getProducts); // * Query for Searching Products Through Search Box
router.get("/category/:categoryName", getProducts);
router.get("/search/:searchQuery", getProducts);
router.get("/", getProducts);
router.get("/bestsellers", getBestSellers);
router.get("/get-one/:id", getProductById);

//* admin routes:
router.use(verifyIsLoggedIn, verifyIsAdmin);
router.get("/admin", adminGetProducts);
router.delete("/admin/:id", adminDeleteProduct);
router.delete("/admin/image/:imagePath/:productId", adminDeleteProductImage);
router.put("/admin/:id", adminUpdateProduct);
router.post("/admin", adminCreateProduct);
router.post("/admin/upload", adminUpload);

module.exports = router;
