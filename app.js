const express = require('express');
const db=require('./db/MondoDB')
const User = require('./Models/User');
const Invoice = require('./Models/Invoice');
const app = express();
const cors = require('cors');
const Customer = require('./Models/Customer');
const Supplier = require('./Models/Supplier');
const Staff = require('./Models/Staff');
const ReceivedPayment = require('./Models/ReceivedPayment');
const PaymentGave = require('./Models/PaymentGave');
const PaymentToSupplier = require('./Models/PaymentToSupplier');
const ReceivedFromSupplier = require('./Models/ReceivedFromSupplier');
const StaffDetails = require('./Models/StaffDetails');
const StaffAttendance = require('./Models/StaffAttendance');
const GstBill = require('./Models/GstBill');
const SalesBill = require('./Models/SalesBill');
const PurchaseBill = require('./Models/purchaseBill');
const Category = require('./Models/Category');
const ExpenseBill = require('./Models/ExpensiveBill');
const Product = require('./Models/ProductForm');



const port = process.env.PORT || 8084;
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/register', async (req, res) => {
  try {
    // Extract data from request body
    const { firstName, lastName, phone, email, password, confirmPassword } = req.body;

    const userSchema = new User({ firstName, lastName, phone, email, password, confirmPassword });
    await userSchema.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/invoice', async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating invoice' });
  }
});

app.post('/customer', async (req, res) => {
  try {
    const customerdata = req.body;
    const newCustomer = new Customer(customerdata);
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).send("Error saving customer");
  }
});

app.get('/customer', async (req, res) => {
  try {
    // Logic to fetch all customers
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

app.post('/supplier', async (req, res) => {
  try {
    const supplierdata = req.body;
    const newSupplier = new Supplier(supplierdata);
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).send("Error saving customer");
  }
});

// Assuming you have a Supplier model set up similarly to your Customer model
app.get('/supplier', async (req, res) => {
  try {
    const suppliers = await Supplier.find({}); // Fetch all suppliers
    res.status(200).json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching suppliers' });
  }
});

app.post('/staff', async (req, res) => {
  try {
    const { name, office, email, number,salary } = req.body;
    
    // Create a new Staff document
    const newStaff = new Staff({ name, office, email, number,salary });

    // Save the new Staff document
    await newStaff.save();

    // Create a new StaffDetails document
    const staffDetails = new StaffDetails({
      staff: newStaff._id, // Link to the Staff document
      // Add other details here
    });

    // Save the new StaffDetails document
    await staffDetails.save();

    // Update the details field of the newStaff document
    newStaff.details = staffDetails._id;
    await newStaff.save();

    res.status(201).json({ message: 'Staff member added successfully', staff: newStaff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding staff member' });
  }
});


app.post('/receivedpayment', async (req, res) => {
  try {
    const { amount, details, date, customerId } = req.body;

    // Check if the customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newReceivedPayment = new ReceivedPayment({
      amount,
      details,
      date,
      customerId: customer._id // Linking the payment to the customer
    });

    await newReceivedPayment.save();
    res.status(201).json({ message: 'Received payment added successfully', receivedPayment: newReceivedPayment });
  } catch (error) {
    console.error('Error adding received payment:', error.message);
    res.status(500).json({ message: 'Error adding received payment' });
  }
});

app.post('/paymentgave', async (req, res) => {
  try {
      const { amount, details, date, customerId } = req.body;

      // Verify the customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
      }

      const newPaymentGave = new PaymentGave({ amount, details, date, customerId });
      await newPaymentGave.save();

      res.status(201).json({ message: 'Payment recorded successfully', paymentGave: newPaymentGave });
  } catch (error) {
      console.error('Error recording payment:', error.message);
      res.status(500).json({ message: 'Error recording payment' });
  }
});

app.get('/receivedpayments/:customerId', async (req, res) => {
  try {
      const payments = await ReceivedPayment.find({ customerId: req.params.customerId });
      res.json(payments);
  } catch (error) {
      res.status(500).send('Server error');
  }
});

// Endpoint to get given payments for a customer
app.get('/paymentgave/:customerId', async (req, res) => {
  try {
      const payments = await PaymentGave.find({ customerId: req.params.customerId });
      res.json(payments);
  } catch (error) {
      res.status(500).send('Server error');
  }
});

// Endpoint to delete a customer
app.delete('/customer/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    
    // Deleting the customer from the database
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully', deletedCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting customer' });
  }
});

// POST endpoint to add a payment made to a supplier
app.post('/paymenttosupplier', async (req, res) => {
  try {
    const { amount, details, date, supplierId } = req.body;

    // Verify the supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const newPaymentToSupplier = new PaymentToSupplier({
      amount,
      details,
      date,
      supplierId: supplier._id // Linking the payment to the supplier
    });

    await newPaymentToSupplier.save();
    res.status(201).json({ message: 'Payment to supplier added successfully', paymentToSupplier: newPaymentToSupplier });
  } catch (error) {
    console.error('Error adding payment to supplier:', error.message);
    res.status(500).json({ message: 'Error adding payment to supplier' });
  }
});

// POST endpoint to add a payment received from a supplier
app.post('/receivedfromsupplier', async (req, res) => {
  try {
    const { amount, details, date, supplierId } = req.body;

    // Check if the supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const newReceivedFromSupplier = new ReceivedFromSupplier({
      amount,
      details,
      date,
      supplierId: supplier._id // Linking the payment to the supplier
    });

    await newReceivedFromSupplier.save();
    res.status(201).json({ message: 'Received payment from supplier added successfully', receivedFromSupplier: newReceivedFromSupplier });
  } catch (error) {
    console.error('Error adding received payment from supplier:', error.message);
    res.status(500).json({ message: 'Error adding received payment from supplier' });
  }
});

// Endpoint to get payments made to a specific supplier
app.get('/paymenttosupplier/:supplierId', async (req, res) => {
  try {
    const payments = await PaymentToSupplier.find({ supplierId: req.params.supplierId });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments made to supplier:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to get payments received from a specific supplier
app.get('/receivedfromsupplier/:supplierId', async (req, res) => {
  try {
    const payments = await ReceivedFromSupplier.find({ supplierId: req.params.supplierId });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments received from supplier:', error);
    res.status(500).send('Server error');
  }
});

app.delete('/supplier/:id', async (req, res) => {
  try {
    const supplierId = req.params.id;
    
    // Deleting the supplier from the database
    const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

    if (!deletedSupplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully', deletedSupplier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting supplier' });
  }
});

app.get('/paymentgave', async (req, res) => {
  try {
    const payments = await PaymentGave.find({});
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments given:', error);
    res.status(500).json({ message: 'Error fetching payments given' });
  }
});




app.get('/receivedpayment', async (req, res) => {
  try {
    const payments = await ReceivedPayment.find({});
    res.json(payments);
  } catch (error) {
    console.error('Error fetching received payments:', error);
    res.status(500).json({ message: 'Error fetching received payments' });
  }
});

app.get('/totalreceivedfromsupplier', async (req, res) => {
  try {
      const totalAmount = await ReceivedFromSupplier.aggregate([
          {
              $group: {
                  _id: null, // Group all documents
                  totalReceived: { $sum: '$amount' } // Sum the amount field
              }
          }
      ]);

      // If there are no documents, return 0
      if (totalAmount.length === 0) {
          return res.json({ totalReceived: 0 });
      }

      // Send the total received amount
      res.json({ totalReceived: totalAmount[0].totalReceived });
  } catch (error) {
      console.error('Error fetching total received from suppliers:', error);
      res.status(500).json({ message: 'Error fetching total received from suppliers' });
  }
});

app.get('/totalpaidtosupplier', async (req, res) => {
  try {
      const totalAmount = await PaymentToSupplier.aggregate([
          {
              $group: {
                  _id: null, // Group all documents
                  totalPaid: { $sum: '$amount' } // Sum the amount field
              }
          }
      ]);

      // If there are no documents, return 0
      if (totalAmount.length === 0) {
          return res.json({ totalPaid: 0 });
      }

      // Send the total paid amount
      res.json({ totalPaid: totalAmount[0].totalPaid });
  } catch (error) {
      console.error('Error fetching total paid to suppliers:', error);
      res.status(500).json({ message: 'Error fetching total paid to suppliers' });
  }
});


// GET endpoint to fetch all staff members
app.get('/staff', async (req, res) => {
  try {
    const staffMembers = await Staff.find(); // Fetch all documents from the 'staff' collection
    res.status(200).json({ staff: staffMembers });
  } catch (error) {
    console.error('Error fetching staff members:', error);
    res.status(500).json({ message: 'Error fetching staff members', error: error.message });
  }
});

app.post('/api/staffdetails', async (req, res) => {
  try {
    // Create a new StaffDetails document using the request body
  
    const newDetails = new StaffDetails(req.body);

    // Save the StaffDetails document
    const savedDetails = await newDetails.save();

    // Sending back the saved StaffDetails
    res.status(201).json(savedDetails);
  } catch (error) {
    // Sending a 400 Bad Request response if an error occurs
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/staffdetails/:staffId', async (req, res) => {
  const staffId = req.params.staffId;
  try {
    const staffDetails = await StaffDetails.findOne({ staff: staffId });
    if (staffDetails) {
      res.status(200).json(staffDetails);
    } else {
      res.status(404).json({ message: 'Staff details not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff details', error: error.message });
  }
});


// app.put('/api/staffdetails/:staffId', async (req, res) => {
//   try {
//       const staffId = req.params.staffId;
//       // const updatedData = req.body;
//       const { present } = req.body;
//       // Assuming yourDatabase.updateStaffDetails is a function that updates staff details in your database
//       const result = await StaffDetails.findByIdAndUpdate(staffId,present);

//       if (result) {
//           res.status(200).send({ message: 'Staff details updated successfully', data: result });
//       } else {
//           res.status(404).send({ message: 'Staff not found' });
//       }
//   } catch (error) {
//       res.status(500).send({ message: 'Error updating staff details', error: error.message });
//   }
// });


// app.put('/api/staffdetails/:staffId', async (req, res) => {
//   const staffId = req.params.staffId;
//   const updatedData = req.body;

//   try {
//       // Check if data exists for the given staffId
//       const existingData = await StaffDetails.findById(staffId);

//       if (existingData) {
//           // Data exists, so update it
//           const updatedStaffDetails = await StaffDetails.findByIdAndUpdate(staffId, updatedData, { new: true });
//           res.status(200).json({ message: 'Staff details updated successfully', data: updatedStaffDetails });
//       } else {
//           // Data does not exist for this staffId
//           res.status(404).json({ message: 'No staff found with this ID to update' });
//       }
//   } catch (error) {
//       // Handle any errors
//       res.status(500).json({ message: 'Error updating staff details', error: error.message });
//   }
// });

app.put('/api/staffdetails/:staffId', async (req, res) => {
  const staffId = req.params.staffId;
  const updatedData = req.body;

  try {
    // First, find the StaffDetails document by the staff reference
    const staffDetails = await StaffDetails.findOne({ staff: staffId });

    if (staffDetails) {
      // If the document exists, update it with the new data
      // Loop through all keys in the updatedData and update them in the staffDetails document
      for (const key in updatedData) {
        staffDetails[key] = updatedData[key];
      }

      // Save the updated document
      const updatedStaffDetails = await staffDetails.save();

      res.status(200).json({ message: 'Staff details updated successfully', data: updatedStaffDetails });
    } else {
      // If no document is found with that staff reference, return a 404
      res.status(404).json({ message: 'Staff details not found for the provided staff ID' });
    }
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error updating staff details', error: error.message });
  }
});






app.get('/api/staffdetails', async (req, res) => {
  try {
    const staffDetails = await StaffDetails.find(); // Fetch all staff details from the database
    res.json(staffDetails); // Send the fetched details as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff details', error: error.message });
  }
});



app.post('/api/attendance', async (req, res) => {
  try {
      // Create a new attendance record using the request body data
      const newAttendance = new StaffAttendance({
          staff: req.body.staffId, // You expect the staff ID to be part of the request body
          date: req.body.date,
          present: req.body.present
      });

      // Save the new attendance record to the database
      const savedAttendance = await newAttendance.save();

      // Send back the saved attendance record
      res.status(201).json(savedAttendance);
  } catch (error) {
      // If an error occurs, send back a 500 status and the error message
      res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance/:staffId', async (req, res) => {
  try {
      const { staffId } = req.params;
      const attendanceRecords = await StaffAttendance.find({ staff: staffId });
      res.status(200).json(attendanceRecords);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Assuming you have a PUT endpoint to update attendance
app.put('/api/attendance/:attendanceId', async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { present } = req.body;

    const updatedAttendance = await StaffAttendance.findByIdAndUpdate(
      attendanceId,
      { present: present },
      { new: true } // This option returns the updated document
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.get('/api/staffdetails/:staffId', async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const staffDetails = await StaffDetails.findOne({ staff: staffId }).populate('staff');

//     if (staffDetails) {
//       res.json(staffDetails);
//     } else {
//       res.status(404).send('Staff details not found');
//     }
//   } catch (error) {
//     console.error('Error fetching staff details:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// Assuming you have already required your Staff model
// const Staff = require('./models/Staff');

app.get('/api/staffdetails/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await Staff.findById(staffId).populate('details');

    if (staff) {
      res.json(staff);
    } else {
      res.status(404).send('Staff not found');
    }
  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    const staff = await Staff.findById(staffId).populate('details'); // Use populate if you want to get the referenced StaffDetails document

    if (!staff) {
      return res.status(404).send('Staff member not found');
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

//report 

// GET total amount received from suppliers
app.get('/api/totalreceived', async (req, res) => {
  try {
    const totalReceived = await ReceivedFromSupplier.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ total: totalReceived[0]?.total || 0 });
  } catch (error) {
    console.error('Error fetching total received:', error);
    res.status(500).send('Error fetching total received from suppliers');
  }
});

// GET total amount paid to suppliers
app.get('/api/totalpaid', async (req, res) => {
  try {
    const totalPaid = await PaymentToSupplier.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
    res.json({ total: totalPaid[0]?.total || 0 });
  } catch (error) {
    console.error('Error fetching total paid:', error);
    res.status(500).send('Error fetching total paid to suppliers');
  }
});

// GET all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).send('Error fetching suppliers');
  }
});

app.post('/gstbills', async (req, res) => {

  try {
    const { billNumber, billDate, billTo, onModel, items, amount } = req.body;

    // Create the new GstBill instance
    const newGstBill = new GstBill({
      billNumber,
      billDate,
      billTo,
      onModel, // Make sure to include this
      items,
      amount
    });

    // Save the new GST bill
    const savedGstBill = await newGstBill.save();

    // Check the onModel field and update the correct model
    if (onModel === 'Customer') {
      await Customer.findByIdAndUpdate(
        billTo,
        { $push: { gstBills: savedGstBill._id } }
      );
    } else if (onModel === 'Supplier') {
      await Supplier.findByIdAndUpdate(
        billTo,
        { $push: { gstBills: savedGstBill._id } }
      );
    }

    res.status(201).json(savedGstBill);
  }  catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', details: error.errors });
    }
    console.error('Error creating GST Bill:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/salesbills', async (req, res) => {
  try {
    // Extracting data from request body
    const { billNumber, billDate, billTo, onModel, items, amount } = req.body;

    // Validating the party type
    if (!['Supplier', 'Customer'].includes(onModel)) {
      return res.status(400).json({ message: "Invalid party type specified." });
    }

    // Create new SalesBill instance
    const newSalesBill = new SalesBill({
      billNumber,
      billDate,
      billTo,
      onModel,
      items,
      amount
    });

    // Save the SalesBill instance to the database
    const savedSalesBill = await newSalesBill.save();

    // Depending on the party type, update the corresponding document
    if (onModel === 'Supplier') {
      await Supplier.findByIdAndUpdate(billTo, {
        $push: { salesBills: savedSalesBill._id }
      });
    } else if (onModel === 'Customer') {
      await Customer.findByIdAndUpdate(billTo, {
        $push: { salesBills: savedSalesBill._id }
      });
    }

    // Respond with the saved document
    res.status(201).json(savedSalesBill);
  } catch (error) {
    console.error('Error creating sales bill:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/purchasebills', async (req, res) => {
  try {
    const { billNumber, billDate, billTo, onModel, items, amount } = req.body;

    // Validate the party type
    if (!['Supplier', 'Customer'].includes(onModel)) {
      return res.status(400).json({ message: "Invalid party type specified." });
    }

    // Create new PurchaseBill instance
    const newPurchaseBill = new PurchaseBill({
      billNumber,
      billDate,
      billTo,
      onModel,
      items,
      amount
    });

    // Save the PurchaseBill instance to the database
    const savedPurchaseBill = await newPurchaseBill.save();

    // Update the corresponding Supplier or Customer
    if (onModel === 'Supplier') {
      await Supplier.findByIdAndUpdate(billTo, { $push: { purchaseBill: savedPurchaseBill._id } });
    } else if (onModel === 'Customer') {
      await Customer.findByIdAndUpdate(billTo, { $push: { purchaseBill: savedPurchaseBill._id } });
    }

    // Respond with the saved PurchaseBill
    res.status(201).json(savedPurchaseBill);
  } catch (error) {
    console.error('Error creating purchase bill:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Error fetching categories');
  }
});

app.post('/api/expensebills', async (req, res) => {
  try {
    const { expenseNumber, date, items, amount, categoryId } = req.body;

    const newExpenseBill = new ExpenseBill({
      expenseNumber,
      date,
      items,
      amount,
      category: categoryId
    });

    const savedExpenseBill = await newExpenseBill.save();
    
    // Optionally, update the category to include this expense bill
    await Category.findByIdAndUpdate(categoryId, {
      $push: { expenseBills: savedExpenseBill._id }
    });

    res.status(201).json(savedExpenseBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/expensebills', async (req, res) => {
  try {
    const expenseBills = await ExpenseBill.find(); // Fetch all expense bills from the database
    res.json(expenseBills); // Send the expense bills as a JSON response
  } catch (error) {
    res.status(500).send('Error fetching expense bills: ' + error.message);
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({}).populate('expenseBills');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch bills by date
// Fetch bills by date and populate customer or supplier info
app.get('/api/bills-by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const salesBills = await SalesBill.find({
      billDate: { $gte: startDate, $lte: endDate }
    }).populate('billTo', 'name'); // Populate the 'name' field of billTo

    const gstBills = await GstBill.find({
      billDate: { $gte: startDate, $lte: endDate }
    }).populate('billTo', 'name'); // Populate the 'name' field of billTo

    res.json({ salesBills, gstBills });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).send('Error fetching bills');
  }
});

app.get('/api/purchase-bills-by-date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const purchaseBills = await PurchaseBill.find({
      billDate: { $gte: startDate, $lte: endDate }
    }).populate('billTo', 'name'); // Assuming 'billTo' is a reference to another collection

    // Send the result back
    res.json(purchaseBills);
  } catch (error) {
    console.error('Error fetching purchase bills:', error);
    res.status(500).send('Internal Server Error');
  }
});


//products section 

app.post('/products', async (req, res) => {
  try {
    const product = new Product({
      // Assuming your form data is sent as a JSON object in the request body
      itemName: req.body.itemName,
      primaryUnit: req.body.primaryUnit,
      secondaryUnit: req.body.secondaryUnit,
      conversionRate: req.body.conversionRate,
      salePrice: req.body.salePrice,
      purchasePrice: req.body.purchasePrice,
      taxIncluded: req.body.taxIncluded,
      openingStock: req.body.openingStock,
      lowStockAlert: req.body.lowStockAlert,
      asOfDate: req.body.asOfDate,
      hsnCode: req.body.hsnCode,
      gstRate: req.body.gstRate,
      useSecondary: req.body.useSecondary,
      productImage: req.body.productImage, // Make sure to send this as a Base64 string
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
    // Send the products as a JSON response
    res.status(200).json(products);
  } catch (error) {
    // If an error occurs, send a 500 status with an error message
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Assuming you have a route to update stock
app.put('/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { operation } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Increment or decrement the stock
    if (operation === 'increment') {
      product.openingStock += 1;
    } else if (operation === 'decrement') {
      product.openingStock -= 1;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product stock', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



