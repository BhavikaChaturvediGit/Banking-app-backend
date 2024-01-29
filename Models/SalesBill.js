const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesBillSchema = new Schema({
  billNumber: {
    type: String,
    required: true
  },
  billDate: {
    type: Date,
    required: true
  },
  billTo: {
    type: Schema.Types.ObjectId, // Can reference either a Supplier or Customer
    required: true,
    refPath: 'onModel' // This will use the `onModel` field to determine the referenced model
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Supplier', 'Customer'] // Only allows these two model names
  },
  items: {
    type: [String], // Assuming items is an array of strings
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('SalesBill', SalesBillSchema);