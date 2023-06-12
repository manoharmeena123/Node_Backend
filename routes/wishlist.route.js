const express = require("express");
const router = express.Router();
const {
    getWishlistByUserId,
    addProductToWishlist,
    removeProductFromWishlist,
} = require("../controllers/wishlistController");

// Create a new wishlist
router.patch("/:userId", addProductToWishlist);

// Get a wishlist by user ID
router.get("/:userId", getWishlistByUserId);

// Update a wishlist
router.patch("/:userId/remove", removeProductFromWishlist);

module.exports = router;
