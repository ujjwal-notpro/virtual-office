const User=require("../models/User");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

//const {Resend}=require("resend");
//const resend=new Resend(process.env.RESEND_API_KEY);
const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const cleanEmail=email?email.trim().toLowerCase() : "";

        console.log("Login request email:", cleanEmail);
        const user = await User.findOne({ email: cleanEmail });
        console.log("DB find result:", user);

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        const isPasswordCorrect=await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
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
            message: "Login successful",
            token:token,
            user:user
        });
        }catch(error) {
        res.status(500).json({
            message:"Login failed",
            error:error.message
        });
    }
};
module.exports = { loginUser};