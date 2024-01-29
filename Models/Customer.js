const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  gstBills: [{
    type: Schema.Types.ObjectId,
    ref: 'GstBill' // Replace 'GstBill' with the name of your GST bill model
  }],
  salesBills: [{
    type: Schema.Types.ObjectId,
    ref: 'SalesBill' // Replace 'SalesBill' with the name of your sales bill model
  }],
  purchaseBill: [{
    type: Schema.Types.ObjectId,
    ref: 'purchaseBill' // Replace 'SalesBill' with the name of your sales bill model
  }]
  // You can add more fields here
});

// Create a model from the schema

module.exports = mongoose.model('Customer', CustomerSchema);