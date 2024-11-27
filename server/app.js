const express=require("express")
const mongoose=require("mongoose")
const app=express()
const port=process.env.PORT||5000
const userRouter=require("./routes/userRoutes")
const loginRouter=require("./routes/loginRoutes")
const adminRouter=require("./routes/adminRoutes")
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000/', // Replace with your frontend's domain
    credentials: true // Allow credentials (cookies) to be sent
  }));

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
app.use(express.json())
app.use("/",loginRouter,userRouter,adminRouter)
mongoose.connect("mongodb://mongodb_new:27017/medical")
.then(()=>{
    console.log("connected to database")
    }).catch((err)=>{
        console.log(err)
        })

