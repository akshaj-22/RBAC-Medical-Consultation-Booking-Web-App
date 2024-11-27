const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userDetails = require('../models/userModel'); // Adjust this path
const router = express.Router();

router.use(cookieParser());

// User Signup Route (Admins cannot sign up via this route)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, age, address, phone } = req.body;

    // Check if user already exists
    const existingUser = await userDetails.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userDetails({
      name,
      email,
      password: hashedPassword,
      age,
      address,
      phone,
      userType: 'user'
      // userType: 'user' // Force userType to 'user'
    });

    const result = await user.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Unified Login Route for Both Users and Admins

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    const user = await userDetails.findOne({ email });
    console.log(user, "user");
    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed- User doesn't exists" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Authentication failed- password doesn't match" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      "mysecret",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("Authtoken", token);
    res.json({
      status: true,
      message: `login success as ${user.userType}`,
      userType: user.userType
    });
    //  console.log('/login in the bakend res', res)
    return res;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("Authtoken");
  res.status(200).send("Logout successful");
  return res;
});

module.exports = router;
