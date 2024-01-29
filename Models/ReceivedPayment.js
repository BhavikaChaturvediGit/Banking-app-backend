const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ReceivedPaymentSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    details: {
        type: String
        // required: false, depending on whether you want this field to be mandatory
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
    // Include other fields as necessary, like file information, if you're storing that.
});

module.exports = mongoose.model('ReceivedPayment', ReceivedPaymentSchema);
