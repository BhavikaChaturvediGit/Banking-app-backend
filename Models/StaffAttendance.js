const mongoose = require('mongoose');

// Define a schema
const Schema = mongoose.Schema;

const StaffAttendanceSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  present: {
    type: Boolean,
    required: true
  },
});

// Create a model from the schema
module.exports = mongoose.model('StaffAttendance', StaffAttendanceSchema);
