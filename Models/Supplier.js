const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
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
  address: {
    type: String,
    required: false
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
  // Additional fields can be added here
});

module.exports = mongoose.model('Supplier', SupplierSchema);
