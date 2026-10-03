const mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO-URI)
.then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.log("MongoDB connextion failed",error);
});