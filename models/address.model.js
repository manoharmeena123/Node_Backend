const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: [true, "address required"],
    },
    city: {
        type: String,
        required: [true, "City is must"],
    },
    state: {
        type: String,
        required: [true, "State Must"],
    },
    pinCode: {
        type: Number,
        required: [true, "Pincode Required"],
    },
    landMark: {
        type: String,
        default: "",
    },
    street: {
        type: String,
        default: "",
        // required: [true, "Street must"],
    },
    userId: {
        type: ObjectId,
        ref: "users",
    },
});

module.exports = mongoose.model("Address", addressSchema);
