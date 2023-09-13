const router = require("express").Router();
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");
const {
    getUserOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    uptadeOrderToDelivered,
    getOrders,
    getOrderForAnalysis
} = require("../controllers/orderController");

//* user logged in routes:
router.use(verifyIsLoggedIn);
router.get("/", getUserOrders);
router.get("/user/:id", getOrder);
router.post("/", createOrder);
router.put("/paid/:id", updateOrderToPaid);

//* admin routes:
router.use(verifyIsAdmin);
router.put("/delivered/:id", uptadeOrderToDelivered);
router.get("/admin", getOrders);
router.get("/analysis/:date", getOrderForAnalysis); 

module.exports = router;
