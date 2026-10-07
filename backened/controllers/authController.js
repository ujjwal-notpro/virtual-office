const User=require("../models/User");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }

        const cleanEmail=email.trim().toLowerCase();

        const user=await User.findOne({
            email:cleanEmail
        });

        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        const isPasswordCorrect=await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }

        const token=jwt.sign(
            {
                userId:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );

        res.status(200).json({
            message:"Login successful",
            token:token,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });

    }catch(error){
        res.status(500).json({
            message:"Login failed",
            error:error.message
        });
    }
};

module.exports={loginUser};