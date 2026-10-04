const express = require("express");
const { loginUser, verifyOTP } = require("../controllers/authController");
const router=express.Router();
router.post("/login",loginUser);

module.exports=router;