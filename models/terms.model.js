const mongoose = require('mongoose');

const termsAndConditionsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["TERMS&CONDITION", "PRIVACY POLICY"],
    },

});

module.exports = mongoose.model('TermsAndConditions', termsAndConditionsSchema);
