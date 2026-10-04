const express = require("express");
const { loginUser, sendOTP, verifyOTP } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;