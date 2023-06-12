const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        uid: {
            type: String,
            required: true,
        },
        bill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Billing",
            required: true,
        },
        deliveryStatus: {
            type: String,
            default: "pending",
            enum: ["pending", "delivered", "cancelled", "returned"],
        },
        receive: {
            type: String,
            default: "0",
        },
        return: {
            type: String,
            default: "0",
        },
        shortage: {
            type: String,
            default: "0",
        },
        balance: {
            type: String,
            default: "0",
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
            default: () => {
                return new Date();
            },
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
