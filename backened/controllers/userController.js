const User=require("../models/User");//controller ko usermodele mil rha hai
const bcrypt = require("bcryptjs");

const createUser=async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        role:req.body.role
        });
        //const user=await User.create(req.body);//jo bhi data aayahai req se usko mongodb ke acc save krna jaise email,name,pass aata hai

        res.status(201).json({
            message:"User created successfully",
            user:user
        });
    }catch(error){
        res.status(201).json({
            message:"User created successfully",
            error:error.message
        });    //try ansd catch usekiya agr koi bhi error aaya crash hone ki bajaye message ye de de
    }
};
module.exports={createUser};