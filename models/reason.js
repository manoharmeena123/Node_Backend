const mongoose = require("mongoose");

const reasonSchema = new mongoose.Schema(
    {
        reason: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reason", reasonSchema);
