const User=require("../models/User");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const crypto=require("crypto");
const {Resend}=require("resend");

const resend=new Resend(process.env.RESEND_API_KEY);

const loginUser=async(req,res)=>{
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

        

        const otp=crypto.randomInt(100000, 1000000).toString();

        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpiresAt=new Date(Date.now()+5*60*1000);

        await user.save();

        const{data,error}=await resend.emails.send({
            from:"onboarding@resend.dev",
            to: user.email,
            subject: "Flowbit Login OTP",
            html: `
                <h2>Flowbit Login OTP</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 5 minutes.</p>
    `
});

if(error){
    return res.status(500).json({
        message:"OTP email failed",
        error:error.message
    });
}

        const token = jwt.sign(//jwt.sign ek JWT token create karta hai.
            {userId: user._id,role:user.role},//Token ke andar hum basic information rakh rahe hain:
            process.env.JWT_SECRET,{expiresIn:"1d"}//Ye .env se secret key leta hai.1d--1day valid rhega token
        );
        res.status(200).json({
            message: "Login successful",
            token: token,
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