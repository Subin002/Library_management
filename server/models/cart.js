const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    author: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: String
    }
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;
