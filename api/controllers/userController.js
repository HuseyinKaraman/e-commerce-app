const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const generateAuthToken = require("../utils/generateAuthToken");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");

const registerUser = async (req, res, next) => {
    try {
        const { name, lastName, email, password } = req.body;

        if (!(name && lastName && email && password)) {
            return res.status(400).send("All input fields are required");
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send("user exist!");
        } else {
            const hassedPassword = hashPassword(password);
            const user = await User.create({
                name,
                lastName,
                email: email.toLowerCase(),
                password: hassedPassword,
            });
            res.cookie(
                "access_token",
                generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin),
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                }
            )
                .status(201)
                .json({
                    success: "User created",
                    userCreated: {
                        _id: user._id,
                        name: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        isAdmin: user.isAdmin,
                    },
                });
        }
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password, doNotLogout } = req.body;

        if (!(email && password)) {
            return res.status(400).send("All input fields are required");
        }

        const user = await User.findOne({ email }).orFail();
        if (user && comparePasswords(password, user.password)) {
            let cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            };

            if (doNotLogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // 7 days
            }

            return res
                .cookie(
                    "access_token",
                    generateAuthToken(user._id, user.name, user.lastName, user.email, user.isAdmin),
                    cookieParams
                )
                .status(200)
                .json({
                    success: "User logged in",
                    userLoggedIn: {
                        _id: user._id,
                        name: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        isAdmin: user.isAdmin,
                        doNotLogout,
                    },
                });
        } else {
            return res.status(401).send("wrong credentials");
        }
    } catch (error) {
        next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).orFail(); // comes from middleware -> verifyAuthToken

        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user?.phoneNumber;
        user.address = req.body.address || user?.address;
        user.country = req.body.country || user?.country;
        user.city = req.body.city || user?.city;
        user.state = req.body.state || user?.state;
        user.zipCode = req.body.zipCode || user?.zipCode;

        if (user && comparePasswords(req.body.password, user.password)) {
            await user.save();

            return res.json({
                success: "user updated successfully",
                userUpdated: {
                    _id: user._id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
            });
        } else {
            return res.status(401).send("wrong credentials");
        }
    } catch (error) {
        next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password -__v ").orFail();
        return res.send(user);
    } catch (error) {
        next(error);
    }
};

const writeReview = async (req, res, next) => {
    const session = await Review.startSession();
    try {
        const { rating, comment } = req.body;

        if (!(comment && rating)) {
            return res.status(400).send("All inputs are required");
        }

        // create review id manually because it is needed for saving in Product collection
        const ObjectId = require("mongoose").Types.ObjectId;
        const reviewId = new ObjectId();

        //* first operation
        session.startTransaction();
        await Review.create(
            [
                {
                    _id: reviewId,
                    comment: comment,
                    rating: Number(rating),
                    user: {
                        _id: req.user._id,
                        name: req.user.name + " " + req.user.lastName,
                    },
                },
            ],
            { session: session } //  I want this review model to be part of the session of the transaction
        );
        const product = await Product.findById(req.params.productId).populate("reviews").session(session).orFail();

        //* session func added
        const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            await session.abortTransaction(); //!Then if already reviewed, then session and board transaction.
            session.endSession();
            return res.status(400).send("product already reviewed");
        }

        let prc = [...product.reviews];
        prc.push({ rating: rating });
        product.reviews.push(reviewId);
        if (product.reviews.length === 1) {
            product.rating = Number(rating);
            product.reviewsNumber = 1;
        } else {
            product.reviewsNumber = product.reviews.length;
            let ratingCalc = prc.reduce((sum, item) => sum + Number(item.rating), 0) / prc.length;
            product.rating = Math.round(ratingCalc);
        }

        await product.save();

        await session.commitTransaction(); //! if everything is successful, then await the session commit transaction
        session.endSession();
        res.send("Review created successfully");
    } catch (error) {
        //!  in case any error, I don't want reviews, collection or product collection to be written in the database
        await session.abortTransaction();
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        return res.send(users);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("name lastName email isAdmin").orFail();
        return res.send(user);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        user.name = req.body.name || user.name;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        await user.save();

        return res.send("user updated");
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).orFail();
        await user.deleteOne();
        return res.status(200).send("user removed");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    updateUserProfile,
    getUserProfile,
    writeReview,
    getUser,
    updateUser,
    deleteUser,
};
