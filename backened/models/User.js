const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"employee"
    },
    otp:{type: String
    },//login ke time generated OTP store hoga
    otpExpiresAt:{type:Date}

});
module.exports=mongoose.model("User",userSchema);