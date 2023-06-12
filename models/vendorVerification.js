const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const vendorVerificationSchema = new Schema(
    {
        userId: {
            type: ObjectId,
            ref: "users",
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerification: {
            type: Boolean,
            default: false,
        },
        phoneVerification: {
            type: Boolean,
            default: false,
        },

        gstinOrPanVerification: {
            type: Boolean,
            default: false,
        },
        gstinOrPanImage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("VendorVerification", vendorVerificationSchema);
