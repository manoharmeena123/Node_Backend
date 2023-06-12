const mongoose = require("mongoose");

const wholesalerOfferSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    image: {
        type: Object,
        default: {},
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    discountPercent: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("WholesalerOffer", wholesalerOfferSchema);
