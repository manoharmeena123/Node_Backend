const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },

        payment_Id: {
            type: String,
        },

        receipt: {
            type: String,
        },

        status: {
            type: String,
            required: true,
            default: "pending",
        },
        amount: {
            type: Number,
            required: true,
            default: 0.0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
