const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  office: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Assuming each staff member has a unique email
    // match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email validation
  },
  number: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please fill a valid phone number'] // Assuming phone numbers are 10 digits
  },
  salary: {
    type:Number,
    required:true
  },
  details: {
    type: Schema.Types.ObjectId,
    ref: 'StaffDetails', // Reference to the StaffDetails model
  },
  // You can add more fields here if needed
});

// Create a model from the schema
module.exports = mongoose.model('Staff', StaffSchema);
