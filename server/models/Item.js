const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ItemSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    borrowed: {
        type: Boolean,
        required : true
    },
    subject: {
        type: String,
        required: true
    },
    image: {
        type: String,       // URL of the image
        required: false     // Optional field
    }
})

module.exports = mongoose.model('Item', ItemSchema);