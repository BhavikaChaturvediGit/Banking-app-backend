const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseBillSchema = new Schema({
  expenseNumber: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  items: {
    type: [String], // Changed to an array of strings
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
  // Additional fields can be added as needed
});

const ExpenseBill = mongoose.model('ExpenseBill', ExpenseBillSchema);
module.exports = ExpenseBill;
