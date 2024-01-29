const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  primaryUnit: {
    type: String,
    required: true
  },
  secondaryUnit: {
    type: String,
    required: function() { return this.useSecondary; } // Conditionally required based on useSecondary
  },
  conversionRate: {
    type: Number,
    required: function() { return this.useSecondary; } // Conditionally required based on useSecondary
  },
  salePrice: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  taxIncluded: {
    type: Boolean,
    default: false
  },
  openingStock: {
    type: Number,
    default: 0
  },
  lowStockAlert: {
    type: Number
  },
  asOfDate: {
    type: Date,
    default: Date.now
  },
  hsnCode: {
    type: String,
    trim: true
  },
  gstRate: {
    type: Number,
    min: 0,
    max: 100
  },
  useSecondary: {
    type: Boolean,
    default: false
  },
  productImage: {
    type: String, // Storing the image as a Base64 encoded string
    required: false // Make this optional or required based on your needs
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
