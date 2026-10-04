const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendEmailOTP, sendSmsOTP } = require("../utils/otpService");

// Standard login (email + password direct)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "default_jwt_secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// Send OTP (Step 1 of 2FA login)
const sendOTP = async (req, res) => {
    try {
        const { email, password, method } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        if (method === "phone" || method === "sms") {
            if (!user.phone) {
                return res.status(400).json({
                    message: "No phone number registered on your account. Please select Email verification."
                });
            }

            try {
                await sendSmsOTP(user.phone, otp);
            } catch (err) {
                console.warn("[OTP] SMS delivery failed, fallback active:", err.message);
            }

            const masked = user.phone.length > 4 
                ? `${"*".repeat(user.phone.length - 4)}${user.phone.slice(-4)}`
                : user.phone;

            return res.status(200).json({
                message: `OTP sent to ${masked}`,
                userId: user._id
            });
        }

        // Default: Email method
        try {
            await sendEmailOTP(user.email, otp, user.name);
        } catch (err) {
            console.warn("[OTP] Email delivery failed, check credentials:", err.message);
            return res.status(500).json({
                message: `Failed to send email OTP: ${err.message}`
            });
        }

        const parts = user.email.split("@");
        const namePart = parts[0];
        const domainPart = parts[1];
        const maskedEmail = namePart.length > 2 
            ? `${namePart.slice(0, 2)}***@${domainPart}`
            : `${namePart.slice(0, 1)}***@${domainPart}`;

        return res.status(200).json({
            message: `OTP sent to ${maskedEmail}`,
            userId: user._id
        });

    } catch (error) {
        console.error("sendOTP error:", error);
        res.status(500).json({
            message: error.message || "Failed to send OTP"
        });
    }
};

// Verify OTP (Step 2 of 2FA login)
const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json({ message: "Please provide user ID and OTP" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.otp || user.otp !== otp.toString().trim()) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            return res.status(400).json({ message: "OTP code has expired. Please request a new one." });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "default_jwt_secret",
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error("verifyOTP error:", error);
        res.status(500).json({
            message: "OTP verification failed",
            error: error.message
        });
    }
};

module.exports = {
    loginUser,
    sendOTP,
    verifyOTP
};