const Product = require("../models/ProductModel");
const recordsPerPage = require("../config/pagination");
const imageValidation = require("../utils/imageValidation");

const getProducts = async (req, res, next) => {
    try {
        // * filter
        let query = filterCondition(req);

        // * sort products by name,price etc
        let sort = {};
        const sortOption = req.query.sort || "";
        if (sortOption) {
            let sortOpt = sortOption.split("_");
            sort = { [sortOpt[0]]: Number(sortOpt[1]) };
        }

        // * pagination
        const pageNum = req.query.pageNum || 1;

        const totalDocuments = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip(recordsPerPage * (pageNum - 1))
            .sort(sort)
            .limit(recordsPerPage);
        res.json({
            products,
            pageNum,
            paginationLinksNumber: Math.ceil(totalDocuments / recordsPerPage),
        });
    } catch (error) {
        next(error);
    }
};

const filterCondition = (req) => {
    // * filter products
    let query = {};
    let queryCondition = false;

    // price condition
    let priceQueryCondition = {};
    if (req.query.price) {
        queryCondition = true;
        priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    }
    // rating condition
    let ratingQueryCondition = {};
    if (req.query.rating) {
        queryCondition = true;
        ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    }

    //! category condition -> Get products from specified category(search bar)
    let categoryQueryCondition = {};
    const categoryName = req.params.categoryName || "";

    if (categoryName) {
        queryCondition = true;
        let a = categoryName.replace(/,/g, "/"); // todo render.com error! for replaceAll
        var regEx = new RegExp("^" + a);
        categoryQueryCondition = { category: regEx };
    }

    // * Or category condition -> from query params
    if (req.query.category) {
        queryCondition = true;
        let a = req.query.category.split(",").map((item) => {
            if (item) return new RegExp("^" + item);
        });
        categoryQueryCondition = {
            category: { $in: a },
        };
    }

    // attrs condition
    let attrsQueryCondition = [];
    if (req.query.attrs) {
        queryCondition = true;
        // example attrs=RAM-1TB-2TB-4TB,color-blue-black
        attrsQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
            if (item) {
                let a = item.split("-"); // ['RAM','1TB','2TB','4TB'],['color','blue','black']
                let values = [...a]; // ['RAM','1TB','2TB','4TB'],['color','blue','black']
                values.shift(); // ['1TB','2TB','4TB'],['blue','black']
                let a1 = {
                    attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
                };
                acc.push(a1);
                // console.dir(acc,{depth: null});
                return acc;
            } else return acc;
        }, []);
    }

    const searchQuery = req.params.searchQuery || "";
    let searchyQueryCondition = {};
    if (searchQuery) {
        queryCondition = true;
        searchyQueryCondition = {
            $text: { $search: searchQuery },
        };
    }

    if (queryCondition) {
        query = {
            $and: [
                priceQueryCondition,
                ratingQueryCondition,
                categoryQueryCondition,
                searchyQueryCondition,
                ...attrsQueryCondition,
            ],
        };
    }

    return query;
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("reviews").orFail();
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const getBestSellers = async (req, res, next) => {
    try {
        const products = await Product.aggregate([
            { $sort: { category: 1, sales: -1 } },
            { $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } } },
            { $replaceWith: "$doc_with_max_sales" },
            { $match: { sales: { $gt: 0 } } },
            { $project: { id: 1, name: 1, category: 1, images: 1, sales: 1, description: 1 } },
            { $limit: 3 },
        ]);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// admin

const adminGetProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ category: 1 }).select("name price category");
        return res.json(products);
    } catch (error) {
        next(error);
    }
};

const adminDeleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).orFail();
        await product.deleteOne();
        res.status(200).send("Product deleted successfully");
    } catch (error) {
        next(error);
    }
};

const adminCreateProduct = async (req, res, next) => {
    try {
        const product = new Product();
        const { name, description, count, price, category, attributes } = req.body;
        product.name = name;
        product.description = description;
        product.count = count;
        product.price = price;
        product.category = category;
        if (attributes.length > 0) {
            attributes.map((item) => {
                product.attrs.push({ key: item[0], value: item[1] });
            });
        }
        await product.save();

        res.json({ message: "product created", productId: product._id });
    } catch (error) {
        next(error);
    }
};

const adminUpdateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).orFail();
        const { name, description, count, price, category, attributes } = req.body;
        product.name = name || product;
        product.description = description || product.description;
        product.count = count || product.count;
        product.price = price || product.price;
        product.category = category || product.category;
        if (attributes?.length > 0) {
            product.attrs = [];
            attributes.map((item) => {
                product.attrs.push({key: item[0], value: item[1]});
            });
        } else {
            product.attrs = [];
        }
        await product.save();

        res.status(200).json({ message: "product Updated", productId: product._id });
    } catch (error) {
        next(error);
    }
};

const adminUpload = async (req, res, next) => {
    try {
        // for cloudinary upload
        if (req.query.cloudinary === "true") {
            try {
                let product = await Product.findById(req.query.productId).orFail();
                product.images.push({ path: req.body.url });
                await product.save();
            } catch (error) {
                next(error);
            }
        }else {
            // for local disk upload
            if (!req.files || !!req.files.images === false) {
                return res.status(404).send("No files were uploaded");
            }
    
            const validateResult = imageValidation(req.files.images);
    
            if (validateResult.error) {
                return res.status(400).send(validateResult.error);
            }
    
            const path = require("path");
            const { v4: uuidv4 } = require("uuid");
            const uploadDirectory = path.resolve(__dirname, "../../client", "public", "images", "products");
    
            let product = await Product.findById(req.query.productId).orFail();
    
            let imagesTable = [];
            if (Array.isArray(req.files.images)) {
                imagesTable = req.files.images;
            } else {
                imagesTable.push(req.files.images);
            }
    
            for (const image of imagesTable) {
                var fiileName = uuidv4() + path.extname(image.name);
                var uploadPath = uploadDirectory + "/" + fiileName;
                product.images.push({ path: "/images/products/" + fiileName });
                image.mv(uploadPath, function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            }
            await product.save();
        }
        return res.send("Files uploaded successfully!");
    } catch (error) {
        next(error);
    }
};

const adminDeleteProductImage = async (req, res, next) => {
    const imagePath = decodeURIComponent(req.params.imagePath); //* on the front end I will encode the path
    if (req.query.cloudinary === "true") {
        try {
            await Product.findOneAndUpdate(
                { _id: req.params.productId },
                { $pull: { images: { path: imagePath } } }
            ).orFail();
            res.end();
        } catch (error) {
            next(error);
        }
        return;
    }
    try {
        const path = require("path");
        const finalPath = path.resolve("../client/public") + imagePath;

        const fs = require("fs");
        fs.unlink(finalPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
        });

        await Product.findOneAndUpdate(
            { _id: req.params.productId },
            { $pull: { images: { path: imagePath } } }
        ).orFail();

        return res.end();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    getBestSellers,
    adminGetProducts,
    adminDeleteProduct,
    adminCreateProduct,
    adminUpdateProduct,
    adminUpload,
    adminDeleteProductImage,
};
