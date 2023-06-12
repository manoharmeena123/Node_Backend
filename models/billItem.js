const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const billItemSchema = new Schema(
    {
        billId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Billing",
        },
        itemName: {
            type: String,
            default: "",
            required: true,
        },
        mrp: {
            type: Number,
            default: 0,
            required: true,
        },
        batch: {
            type: String,
            default: "",
            required: true,
        },
        expiry: {
            type: Date,
            default: "",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        },
        pilotNumber: {
            type: String,
            default: "",
            required: true,
        },
        comment: {
            type: String,
            default: "",
        },
        return: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("BillItems", billItemSchema);
