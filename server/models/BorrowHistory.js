const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BorrowHistorySchema = new Schema({
    item_id: {
        type: Schema.Types.ObjectId,
        ref: "Item", // Reference to the Item model
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    quantity_borrowed: {
        type: Number,
        required: true,
        min: 1, // Ensure at least 1 item is borrowed
    },
    borrowed_at: {
        type: Date,
        default: Date.now, // Automatically set when the item is borrowed
    },
    returned_at: {
        type: Date,
        default: null, // Nullable until the item is returned
    },
});

module.exports = mongoose.model("BorrowHistory", BorrowHistorySchema);