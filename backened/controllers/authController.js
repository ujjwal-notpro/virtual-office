const User = require("../models/User");
const jwt = require("jsonwebtoken");//
const bcrypt = require("bcryptjs");

const loginUser = async (req,res)=>{

    try{
        const{email,password}=req.body;
        const user = await User.findOne({ email: email });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
         const isPasswordCorrect = await bcrypt.compare(//bcrypt.compare() check kregaki dono match karte hain ya nahi.
            password,
            user.password//user.password = MongoDB me stored hashed password
        );
        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        res.status(200).json({
            message: "Login successful",
            user: user
        });
        } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {loginUser};