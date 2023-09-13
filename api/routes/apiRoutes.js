const router = require("express").Router();

const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");

const jwt = require("jsonwebtoken");

router.get("/get-token", (req, res) => {
    try {
        const accessToken = req.cookies["access_token"];
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        return res.json({
            token: decoded.name,
            isAdmin: decoded.isAdmin,
        });
    } catch (error) {
        return res.status(401).send("UnAuthorized.Invalid Token");
    }
});

router.get("/logout",(req,res)=>{
    return res.clearCookie("access_token").status(200).send("access token cleared");
})

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
