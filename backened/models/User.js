const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:[4,"Name must be at least 2 characters"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        match:[
             /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            "Please enter a valid Gmail address"
        ]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        default:"employee"
    }
});

module.exports=mongoose.model("User",userSchema);