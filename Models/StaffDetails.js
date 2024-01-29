const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StaffDetailsSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff', // Reference to the Staff model
    required: true,
  },
  address: String,
  dateOfBirth: Date,
  emergencyContact: String,
  employeeID: String,
  startDate: Date,
  department: String,
  supervisor: String,
  salary: Number,
  payFrequency: String,
  benefits: String,
  certifications: String,
  performanceFeedback: String,
  leaveBalance: String,
  
  notes: String,
});

module.exports = mongoose.model('StaffDetails', StaffDetailsSchema);



