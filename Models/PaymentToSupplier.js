const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PaymentToSupplierSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        // If you want this field to be mandatory, set required to true
    },
    date: {
        type: Date,
        default: Date.now
    },
    supplierId: {
        type: ObjectId,
        ref: 'Supplier', // Ensure 'Supplier' matches your Supplier model name
        required: true
    },
    // file: {
    //     // Assuming you want to store file information if there's any file associated with the payment
    //     filename: String,
    //     path: String,
    //     contentType: String,
    //     // Include any other file-related fields as necessary
    // }
    // Add any other fields that are relevant for your application's requirements
});

module.exports = mongoose.model('PaymentToSupplier', PaymentToSupplierSchema);
