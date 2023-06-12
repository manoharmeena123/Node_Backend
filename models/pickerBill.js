const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        picker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        billId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Billing",
            required: true,
        },
        billItems: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "BillItems",
            required: true,
        },
        numberOfTrays: {
            type: Number,
            required: true,
        },
        pickedStatus: {
            type: String,
            default: "pending",
        },
        assignedVerifier: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Admin",
        },
        reassign: {
            type: Boolean,
            default: false,
        },
        pickerComment: {
            type: String,
            default: "",
        },
        acceptanceStatus: {
            type: String,
            default: "pending",
        },
        verifierBill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "VerifierBill",
        },
    },
    { timestamps: true }
);

// couponSchema.index({ couponCode: 1 }, { unique: true });

module.exports = mongoose.model("PickerBill", couponSchema);
