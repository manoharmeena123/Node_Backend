const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
        vehicleType: {
            type: String,
            default: "",
            required: true,
        },
        model: {
            type: String,
            default: "",
            required: true,
        },
        pollutionCard: {
            type: String,
            required: true,
        },
        insurance: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
            required: true,
        },
        registrationCertificate: {
            type: String,
            default: "",
            required: true,
        },
        vehicleNumber: {
            type: String,
            default: "",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vehicle", schema);
