require("dotenv").config();
var helmet = require("helmet");
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

app.use(helmet()); // for security purposes!
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

const apiRoutes = require("./routes/apiRoutes");

// mongodb connection
const connectDB = require("./config/db");
connectDB();

app.use("/api", apiRoutes);

const path = require("path");
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../client", "build", "index.html")));
} else {
    app.get("/", (req, res) => {
        res.json({ message: "API is running..." });
    });
}

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.error(error);
    }
    next(error);
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        res.status(500).json({
            message: error.message,
            stack: error.stack,
        });
    } else {
        res.status(500).json({
            message: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
