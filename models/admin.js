const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
        },
        password: { type: String },
        mobile: {
            type: String,
            default: "",
        },
        role: { type: String, default: "" },
        employeeId: {
            type: String,
            default: "",
        },
        department: { type: String, default: "" },
        otp: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Admin", schema);
