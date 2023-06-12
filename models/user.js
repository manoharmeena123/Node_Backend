const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: "User",
        },

        mobile: {
            type: String,
            default: "",
        },
        mobileVerified: {
            type: Boolean,
            default: false,
        },

        alternateMobile: {
            type: String,
            default: "",
        },
        panCard: {
            type: [],
            default: [],
        },
        profile: {
            type: String,
            default: "",
        },
        aadharCard: {
            type: String,
            default: "",
        },
        drivingLicense: {
            type: String,
            default: "",
        },

        verification: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Approved", "Rejected"],
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
