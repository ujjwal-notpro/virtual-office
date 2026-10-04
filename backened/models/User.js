const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,        // 👈 extra space hata dega
        lowercase: true
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
    otpExpiresAt:{type:Date}//OTP ki expiry time store hogi, e.g. 5 minutes

});
module.exports=mongoose.model("User",userSchema);