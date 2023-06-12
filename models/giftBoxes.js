const mongoose = require("mongoose");

const giftBoxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: Object,
        default: {},
    },
    price: {
        type: Number,
        required: true,
    },
    products: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Product",
        required: true,
    },
});

module.exports = mongoose.model("GiftBox", giftBoxSchema);
