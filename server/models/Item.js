const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    image: {
        type: String,       // URL of the image
        required: false     // Optional field
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, // Default quantity is 1
    },
})

module.exports = mongoose.model('Item', ItemSchema);