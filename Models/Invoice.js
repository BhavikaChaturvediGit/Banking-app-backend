const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  rate: Number,
  amount: Number,
  gstPercentage: Number,
  gstAmount: Number
});

const PartySchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  phone: String,
  email: String,
  pan: String,
  gst: String
});

const TransportDetailsSchema = new mongoose.Schema({
  modeOfTransport: String,
  transporterName: String,
  distanceKm: String,
  vehicleType: String,
  vehicleNumber: String,
  transactionType: String
});

const ShippingDetailsSchema = new mongoose.Schema({
  shippedFrom: PartySchema,
  shippedTo: PartySchema,
  transportDetails: TransportDetailsSchema
});

const DiscountsAdditionalChargesSchema = new mongoose.Schema({
  discount: Number,
  additionalCharges: Number
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: String,
  invoiceDate: Date,
  dueDate: Date,
  logo: String,
  billedBy: PartySchema,
  billedTo: PartySchema,
  items: [ItemSchema],
  discountsAdditionalCharges: DiscountsAdditionalChargesSchema,
  total: Number,
  termsConditions: String,
  notes: String,
  isRecurring: Boolean,
  repeatInterval: String,
  nextRepeatDate: Date,
  currency: String,
  tax: Number,
  shippingDetails: ShippingDetailsSchema
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
