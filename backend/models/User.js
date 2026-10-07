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
        trim:true,        // 👈 extra space hata dega
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"employee"
    }
    

});
module.exports=mongoose.model("User",userSchema);