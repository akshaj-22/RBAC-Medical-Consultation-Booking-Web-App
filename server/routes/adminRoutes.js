const express = require('express');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// const User = require('../models/userModel.js');
const userDetails = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const Appointment = require('../models/appointmentModel.js');
const Doctor = require('../models/doctorModel.js');

const router = express.Router();

// Middleware
router.use(cookieParser());
router.use(express.json());

// Verify Token Middleware with User Type Check ADMIN
const adminVerifyTokenAndUserType = (req, res, next) => {
  const token = req.cookies.Authtoken;
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, 'mysecret');
    req.email = decoded.email;
    req.userType = decoded.userType; // Assuming token contains userType

    if (req.userType !== 'admin') {
      return res.status(403).json({ message: "Access denied. Not a user." });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};
  //show all appointments for the particular date
  router.get("/appointment-print/:date",adminVerifyTokenAndUserType,async(req,res)=>{
    try{
    const date=req.params.date
    const appointments=await Appointment.find({date:date})
    console.log(appointments)
    res.status(200).send(appointments)
    }catch(error){
      console.log(error)
    }

    

  })

  //admin functionality start

  // Add a new doctor
router.post('/doctors', adminVerifyTokenAndUserType, async (req, res) => {
  try {
    const { name, specialization, availableDates } = req.body;

    const doctor = new Doctor({
      name,
      specialization,
      availableDates
    });

    const result = await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: result });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update doctor availability
router.put('/doctors/:id', adminVerifyTokenAndUserType, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, availableDates } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(id, {
      name,
      specialization,
      availableDates
    }, { new: true });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get a specific doctor by ID
router.get('/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ doctor });
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete a specific doctor by ID
router.delete('/doctors/:id', adminVerifyTokenAndUserType, async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// router.delete('/doctors/:id', adminVerifyTokenAndUserType, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const doctor = await Doctor.findByIdAndDelete(id);

//     if (!doctor) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }

//     res.status(200).json({ message: 'Doctor deleted successfully' });
//   } catch (err) {
//     console.error("Error deleting doctor:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


  //admin functionality end

  router.post('/add-admin', async (req, res) => {
      const name = 'admin';
      const email = 'admin@gmail.com';
      const password = '$2b$10$bh1NWOlJCHR8ogpaGBCtvOwDxQvuunJQWiV0c0wplaROsGe0OYCeS'; // password: admin
      const existingAdmin = await userDetails.findOne({ email });
      if (existingAdmin) {
        return res.status(201).json({ message: 'Admin already exists' });
      }
      const admin = new userDetails({
        name,
        email,
        password,
        userType: 'admin', 
      });
      const result = await admin.save();
      res.status(201).json({ message: 'Admin created successfully', admin: result });
  })

  //////////////////////////
  // Add User Route (Admin Only)
router.post('/add-user', adminVerifyTokenAndUserType, async (req, res) => {
  try {
      const { name, password, email } = req.body;

      if (!name || !password || !email ) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userDetails({ name, password: hashedPassword, email });
      await newUser.save();

      res.status(201).json({ message: 'user added successfully' });
  } catch (error) {
      console.error('Add user error:', error);
      res.status(500).json({ error: 'Failed to add user' });
  }
});

// Admin - Get All Users
router.get('/users', adminVerifyTokenAndUserType, async (req, res) => {
  try {
      const users = await userDetails.find({});
      res.json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Edit User Route (Admin Only)
// Update User by Admin (PUT)
router.put('/users/:id', adminVerifyTokenAndUserType, async (req, res) => {
  try {
      const { id } = req.params;
      const { username, email, status } = req.body;

      // Find the user by ID and update fields
      const updatedUser = await userDetails.findByIdAndUpdate(
          id,
          { username, email, status },
          { new: true } // Return the updated user
      );

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete User Route (Admin Only)
router.delete('/users/:id', adminVerifyTokenAndUserType, async (req, res) => {
  try {
      const { id } = req.params;

      const deletedUser = await userDetails.findByIdAndDelete(id);

      if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
  }
});



module.exports = router;
