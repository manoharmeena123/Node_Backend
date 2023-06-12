const Wishlist = require("../models/wishlist");

const createResponse = (res, statusCode, message = "", data = null) => {
    const status = statusCode >= 200 && statusCode < 300 ? true : false;
    return res.status(statusCode).json({
        success: status,
        message: message,
        data: data,
    });
};

// GET wishlist by user ID
const getWishlistByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const wishlist = await Wishlist.findOne({ userId }).populate(
            "products"
        );
        if (!wishlist)
            return createResponse(res, 404, "wishlist not found", null);
        if (!wishlist.products.length)
            return createResponse(res, 200, "no products added", null);

        return createResponse(
            res,
            200,
            "Wishlist retrieved successfully",
            wishlist
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Something went wrong", null);
    }
};

// ADD product to wishlist
const addProductToWishlist = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.body.productId;
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $addToSet: { products: productId } },
            { upsert: true, new: true }
        );
        return createResponse(res, 200, "Product added to wishlist", wishlist);
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Something went wrong", null);
    }
};

// REMOVE product from wishlist
const removeProductFromWishlist = async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.body.productId;
        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { products: productId } },
            { new: true }
        );
        return createResponse(
            res,
            200,
            "Product removed from wishlist",
            wishlist
        );
    } catch (error) {
        console.error(error);
        return createResponse(res, 500, "Something went wrong", null);
    }
};

module.exports = {
    getWishlistByUserId,
    addProductToWishlist,
    removeProductFromWishlist,
};
