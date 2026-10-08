const User=require("../models/User");
const bcrypt=require("bcryptjs");

const createUser=async(req,res)=>{
    try{
        const{name,email,password,role}=req.body;

        // 1. Required fields
        if(!name||!email||!password){
            return res.status(400).json({
                message:"Name, email and password are required"
            });
        }

        const cleanName=name.trim();
        const cleanEmail=email.trim().toLowerCase();

        // 2. Name validation
        // Minimum 4 characters
        // Only letters and spaces
        const nameRegex=/^[A-Za-z ]+$/;

        if(cleanName.length<4){
            return res.status(400).json({
                message:"Name must be at least 4 characters"
            });
        }

        if(!nameRegex.test(cleanName)){
            return res.status(400).json({
                message:"Name can contain only letters and spaces"
            });
        }

        // 3. Gmail validation
        const emailRegex=/^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if(!emailRegex.test(cleanEmail)){
            return res.status(400).json({
                message:"Please enter a valid Gmail address"
            });
        }

        // 4. Password validation
        // Minimum 8 characters
        // At least 1 uppercase
        // At least 1 lowercase
        // At least 1 number
        // At least 1 special character
        const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if(!passwordRegex.test(password)){
            return res.status(400).json({
                message:"Password must contain uppercase, lowercase, number and special character and be at least 8 characters"
            });
        }

        // 5. Duplicate email
        const existingUser=await User.findOne({
            email:cleanEmail
        });

        if(existingUser){
            return res.status(409).json({
                message:"Email already registered"
            });
        }

        // 6. Hash password
        const hashedPassword=await bcrypt.hash(password,10);

        // 7. Save user
        const user=await User.create({
            name:cleanName,
            email:cleanEmail,
            password:hashedPassword,
            role:role||"employee"
        });

        // 8. Never return password
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