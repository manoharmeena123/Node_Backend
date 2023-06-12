const mongoose = require("mongoose");
const billSchema = new mongoose.Schema(
    {
        verifier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        pickerBill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PickerBill",
            required: true,
        },

        verifierComment: {
            type: String,
            default: "",
        },
        verificationStatus: {
            type: String,
            default: "pending",
        },
        reassign: {
            type: Boolean,
            default: false,
        },
        acceptanceStatus: {
            type: String,
            default: "pending",
        },
        assignedPacker: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("VerifierBill", billSchema);
