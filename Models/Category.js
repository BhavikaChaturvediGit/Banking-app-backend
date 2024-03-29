const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    expenseBills: [{
      type: Schema.Types.ObjectId,
      ref: 'ExpenseBill'
    }]
    // Other fields...
  });
  
  const Category = mongoose.model('Category', categorySchema);
  module.exports = Category;
  