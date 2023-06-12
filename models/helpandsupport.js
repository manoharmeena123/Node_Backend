const mongoose = require('mongoose');



const helpandSupport = mongoose.Schema({
    user: {
        type: String
    },
    name: {
        type: String,
    },
    email: {
        type: String
    }, 
    query: {
        type: String
    }
})


const help = mongoose.model('help&suuport', helpandSupport);

module.exports = help