const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ReceivedFromSupplierSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    details: {
        type: String
        // "required" is commented out; you can make it required by setting it to true
    },
    date: {
        type: Date,
        default: Date.now
    },
    supplierId: {
        type: ObjectId,
        ref: 'Supplier', // Make sure 'Supplier' matches your Supplier model name
        required: true
    },
    // file: {
    //     // Assuming you want to store file information if there's any file associated with the payment
    //     filename: String,
    //     path: String,
    //     contentType: String,
    //     // Include any other file-related fields as needed
    // }
    // Add any other fields that are relevant for your application's logic
});

module.exports = mongoose.model('ReceivedFromSupplier', ReceivedFromSupplierSchema);
