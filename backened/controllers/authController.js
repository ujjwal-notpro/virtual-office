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
        res.status(200).json({
            message: "OTP sent successfully",
            email: user.email
        });
        } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.otp || !user.otpExpiresAt) {
            return res.status(400).json({
                message: "OTP not found"
            });
        }

        if (new Date() > user.otpExpiresAt) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const isOTPValid = await bcrypt.compare(otp, user.otp);

        if (!isOTPValid) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            token: token,
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: "OTP verification failed",
            error: error.message
        });
    }
};

module.exports = { loginUser, verifyOTP };