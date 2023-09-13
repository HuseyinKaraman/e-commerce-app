const router = require("express").Router();
const { getCategories, newCategory, deleteCategory, saveAttr } = require("../controllers/categoryController");
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken");


router.get("/", getCategories);

//* admin routes:
router.use(verifyIsLoggedIn, verifyIsAdmin);
router.post("/", newCategory);
router.delete("/:category", deleteCategory);
router.post("/attr", saveAttr);

module.exports = router;
