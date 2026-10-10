
const mongoose=require("mongoose");
require("dotenv").config();

//ye .env file se MONGO_URI lekar MongoDB se connect krega
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.log("MongoDB connection failed",error.message);
        process.exit(1);
    }
};
module.exports=connectDB;
