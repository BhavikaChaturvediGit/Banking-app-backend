const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PaymentGaveSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: false // Optional, depending on your requirements
    },
    date: {
        type: Date,
        default: Date.now
    },
    customerId: {
        type: ObjectId,
        ref: 'Customer',
        required: true
    },
    // If storing file information, include fields for that here
    // e.g., fileName: { type: String, required: false }
});

module.exports = mongoose.model('PaymentGave', PaymentGaveSchema);
