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

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("RESET BODY:", req.body);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("RESET ERROR:", error);

        res.status(500).json({
            message: "Password reset failed",
            error: error.message
        });
    }
};





module.exports={createUser,resetPassword};