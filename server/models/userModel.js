// const express= require("express")
// const bcrypt=require("bcryptjs")

// postRegistration(req,res,()=>{

// })
const { Schema } = require('mongoose');
const { model } = require('mongoose');

const usersDetails = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: "active" },
  age: { type: String, },
  address: { type: String },
  phone: { type: String },
  userType: {
    type: String,
    enum: ['user', 'admin'], // Allow only 'user' or 'admin' types
    default: 'user' // Default to 'user' for new signups
  }
});

const userDetails = model('userdetails', usersDetails);
module.exports = userDetails;
