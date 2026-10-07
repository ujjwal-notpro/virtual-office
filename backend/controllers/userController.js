const User=require("../models/User");//controller ko usermodele mil rha hai
const bcrypt = require("bcryptjs");//bcryptjs password ko hash karne ke kaam aata hai.

const createUser=async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);//bcrypt.hash(...)---ye $2b$10$...form mein krdeta hai

        const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        role:req.body.role
        });
        
        res.status(201).json({
            message:"User created successfully",
            user:user
        });
    }catch(error){
        res.status(500).json({
            message:"User created failed",
            error:error.message
        });    //try ansd catch usekiya agr koi bhi error aaya crash hone ki bajaye message ye de de
    }
};







module.exports={createUser};