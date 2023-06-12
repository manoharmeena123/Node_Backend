const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        role: {
            type: String,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Role", schema);
