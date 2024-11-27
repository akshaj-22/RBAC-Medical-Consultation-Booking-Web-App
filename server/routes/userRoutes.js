const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../models/userModel.js');
const Appointment = require('../models/appointmentModel.js');
const Doctor = require('../models/doctorModel.js')

const router = express.Router();

// Middleware
router.use(cookieParser());
router.use(express.json());

// Verify Token Middleware with User Type Check
const verifyTokenAndUserType = (req, res, next) => {
  const token = req.cookies.Authtoken;
  console.log("token vr", token )
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, 'mysecret');
    req.email = decoded.email;
    req.userType = decoded.userType; // Assuming token contains userType

    if (req.userType !== 'user') {
      return res.status(403).json({ message: "Access denied. Not a user." });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};
//get profile
router.get("/profile", verifyTokenAndUserType,  async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit Profile Route
router.put("/edit-profile", verifyTokenAndUserType, async (req, res) => {
  try {
    const { newName, newAddress, newAge, newPhone } = req.body;

    const user = await User.findOne({ email: req.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = newName || user.name;
    user.address = newAddress || user.address;
    user.age = newAge || user.age;
    user.phone = newPhone || user.phone;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error editing profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Make Appointment Route
router.post("/appointment", verifyTokenAndUserType, async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.email });
    const { doctorName, date, time } = req.body;
    const appointmentData = {
      patientName: userData.name,
      patientEmail: userData.email,
      doctorName,
      date,
      time,
    };

    // Create the appointment
    const result = await Appointment.create(appointmentData);

    // Find the doctor by name
    const doctor = await Doctor.findOne({ name: doctorName });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Parse the selected time range
    const [startTime, endTime] = time.split(" - ");

    // Update the doctor's available dates and times
    const updatedDates = doctor.availableDates.map((dateEntry) => {
      if (new Date(dateEntry.date).toISOString().split("T")[0] === date) {
        // Remove the time slot
        dateEntry.times = dateEntry.times.filter(
          (timeSlot) =>
            timeSlot.startTime !== startTime || timeSlot.endTime !== endTime
        );
      }
      return dateEntry;
    }).filter(dateEntry => dateEntry.times.length > 0); // Remove dates with no times left

    // Save the updated doctor document
    doctor.availableDates = updatedDates;
    await doctor.save();

    res.status(201).json({ message: "Appointment created successfully", appointment: result });
  } catch (err) {
    console.error("Error making appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.get("/appointment", verifyTokenAndUserType, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientEmail: req.email });
    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete Appointment Route
router.delete("/appointment/:id", verifyTokenAndUserType, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the appointment to delete
    const appointment = await Appointment.findOneAndDelete({ _id: id, patientEmail: req.email });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Extract the appointment details
    const { doctorName, date, time } = appointment;
    const [startTime, endTime] = time.split(' - '); // Assuming time format is 'start - end'

    // Find the corresponding doctor by name
    const doctor = await Doctor.findOne({ name: doctorName });

    if (doctor) {
      // Find the date index
      const dateIndex = doctor.availableDates.findIndex((availableDate) =>
        availableDate.date.toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10)
      );

      if (dateIndex !== -1) {
        // Add the time slot back to the available times
        doctor.availableDates[dateIndex].times.push({ startTime, endTime });
      } else {
        // Add a new date entry with the time slot
        doctor.availableDates.push({
          date: new Date(date),
          times: [{ startTime, endTime }],
        });
      }

      // Save the updated doctor document
      await doctor.save();
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
