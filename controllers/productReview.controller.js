const Review = require("../models/productReview");
const { createResponse } = require("../utils/response");

const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
    const { userId, productId, rating, comment } = req.body;

    try {
        // Create new review
        const newReview = new Review({
            userId,
            productId,
            name: req.user.name,
            rating,
            comment,
        });
        const savedReview = await newReview.save();

        // Get all reviews for this product
        // const reviews = await Review.find({ productId });

        // Calculate the average rating
        // let totalRating = 0;
        // reviews.forEach((review) => {
        //     totalRating += review.rating;
        // });
        // const avgRating = totalRating / reviews.length;

        // // Update the product document with the new average rating
        // const product = await Product.findByIdAndUpdate(
        //     productId,
        //     { $set: { rating: avgRating } },
        //     { new: true }
        // );
        const result = await Review.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(req.body.productId),
                },
            },
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);
        if (result.length > 0) {
            const { avgRating } = result[0];
            const updatedProduct = await Product.findByIdAndUpdate(
                req.body.productId,
                { rating: avgRating },
                { new: true }
            );
            console.log(updatedProduct);
        }
        createResponse(res, 200, "Review posted successfully", savedReview);
    } catch (error) {
        console.log(error);

        createResponse(res, 500, "Internal server error");
    }
};

// POST /api/reviews

// GET /api/reviews/:id
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            createResponse(res, 404, "Review not found");
            return;
        }

        createResponse(res, 200, "Review retrieved successfully", review);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server Error");
    }
};

// GET /api/reviews/product/:productId
exports.getAllReviews = async (req, res) => {
    try {
        let queryObj = {};
        if (req.query.rating) {
            queryObj.rating = req.query.rating;
        }
        if (req.query.productId) {
            queryObj.productId = req.query.productId;
        }
        const reviews = await Review.find(queryObj).lean();

        createResponse(res, 200, "Reviews retrieved successfully", reviews);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server Error");
    }
};

// PUT /api/reviews/:id
exports.updateReviewById = async (req, res) => {
    try {
        const { name, rating, comment } = req.body;

        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!review) {
            createResponse(res, 404, "Review not found");
            return;
        }
        if (rating) {
            console.log(rating);
            const result = await Review.aggregate([
                {
                    $match: {
                        productId: new mongoose.Types.ObjectId(
                            review.productId
                        ),
                    },
                },
                {
                    $group: {
                        _id: "$productId",
                        avgRating: { $avg: "$rating" },
                    },
                },
            ]);
            //     console.log(result);
            if (result.length > 0) {
                const { avgRating } = result[0];
                const updatedProduct = await Product.findByIdAndUpdate(
                    review.productId,
                    { rating: avgRating },
                    { new: true }
                );
                // console.log(updatedProduct);
            }
        }

        createResponse(res, 200, "Review updated successfully", review);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server Error");
    }
};

// DELETE /api/reviews/:id
exports.deleteReviewById = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            createResponse(res, 404, "Review not found");
            return;
        }
        const result = await Review.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(review.productId),
                },
            },
            {
                $group: {
                    _id: "$productId",
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);
        console.log(result);
        if (result.length > 0) {
            const { avgRating } = result[0];
            const updatedProduct = await Product.findByIdAndUpdate(
                review.productId,
                { rating: avgRating },
                { new: true }
            );
            console.log(updatedProduct);
        }

        createResponse(res, 200, "Review deleted successfully");
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server Error");
    }
};
