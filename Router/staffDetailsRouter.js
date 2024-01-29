// staffDetailsRouter.js
const express = require('express');
const router = express.Router();
const StaffDetails = require('./StaffDetailsModel'); // Adjust the path as needed

router.post('/staffdetails', async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      address,
      dateOfBirth,
      emergencyContact,
      employeeID,
      startDate,
      department,
      supervisor,
      salary,
      payFrequency,
      benefits,
      certifications,
      performanceFeedback,
      leaveBalance,
      attendanceRecords,
      notes,
    } = req.body;

    // Create a new StaffDetails document
    const newStaffDetails = new StaffDetails({
      dateOfBirth,
      emergencyContact,
      employeeID,
      startDate,
      department,
      supervisor,
      salary,
      payFrequency,
      benefits,
      certifications,
      performanceFeedback,
      leaveBalance,
      attendanceRecords,
      notes,
    });

    // Save the StaffDetails document
    await newStaffDetails.save();

    // Assuming you have a reference to the related Staff model, you can associate it here
    // const staff = await Staff.findById(staffId); // Adjust this based on your actual logic
    // newStaffDetails.staff = staff;
    // await newStaffDetails.save();

    res.status(201).json({ message: 'StaffDetails added successfully', staffDetails: newStaffDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding StaffDetails', error: error.message });
  }
});

module.exports = router;
