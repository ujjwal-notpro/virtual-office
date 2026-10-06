require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash("Flowbit@12345", 10);

        const user = await User.findOneAndUpdate(
            { email: "ayushgupta2170@gmail.com" },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("User not found");
            return;
        }

        console.log("Password reset successfully");
        console.log("Email:", user.email);

    } catch (error) {
        console.error("Password reset failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

resetPassword();