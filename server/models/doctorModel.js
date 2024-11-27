// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const {model}=require('mongoose');
const { Schema } = require('mongoose');
const { model } = require('mongoose');

const doctorSchema = new Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  availableDates: [{
    date: { type: Date, required: true },
    times: [{
      startTime: { type: String, required: true }, // e.g., '09:00 AM'
      endTime: { type: String, required: true }   // e.g., '05:00 PM'
    }]
  }]
});

const Doctor = model('Doctor', doctorSchema);

module.exports = Doctor;
