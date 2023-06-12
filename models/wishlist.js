const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
    products: {
        type: [mongoose.Types.ObjectId],
        ref: "Product",
    },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
