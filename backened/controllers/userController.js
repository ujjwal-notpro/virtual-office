const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone: phone || "",
            password: hashedPassword,
            role: role || "employee"
        });
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "User creation failed",
            error: error.message
        });
    }
};

module.exports = { createUser };