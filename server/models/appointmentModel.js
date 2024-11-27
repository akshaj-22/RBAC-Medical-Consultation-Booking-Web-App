// const express= require("express")
// const bcrypt=require("bcryptjs")

// postRegistration(req,res,()=>{

// })
const {Schema}=require('mongoose');
const {model}=require('mongoose');

const appointmentsDetails=new Schema({
    patientName:{type:String,required:true},
    patientEmail:{type:String,required:true},
    doctorName:{type:String,required:true},
    date:{type:String,required:true},
    time:{type:String,required:true}
    



})

const appointmentDetails=model('appointmentdetails',appointmentsDetails);
module.exports=appointmentDetails;