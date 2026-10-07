const User=require("../models/User");
const bcrypt=require("bcryptjs");

const createUser=async(req,res)=>{
    try{
        const{name,email,password,role}=req.body;

        if(!name||!email||!password){
            return res.status(400).json({
                message:"Name, email and password are required"
            });
        }

        const cleanEmail=email.trim().toLowerCase();

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if(!emailRegex.test(cleanEmail)){
            return res.status(400).json({
                message:"Please enter a valid email"
            });
        }

        if(!passwordRegex.test(password)){
            return res.status(400).json({
                message:"Password must contain uppercase, lowercase, number and special character and be at least 8 characters"
            });
        }

        const existingUser=await User.findOne({
            email:cleanEmail
        });

        if(existingUser){
            return res.status(409).json({
                message:"Email already registered"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name:name.trim(),
            email:cleanEmail,
            password:hashedPassword,
            role:role
        });

        res.status(201).json({
            message:"User created successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });

    }catch(error){
        res.status(400).json({
            message:"User registration failed",
            error:error.message
        });
    }
};

module.exports={createUser};