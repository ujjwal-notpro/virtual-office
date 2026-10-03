const express = require("express");
const {createTask}=require("../controllers/taskController");

const authMiddleware=require("../middleware/authMiddleware");//Check karega ki user login/token ke saath request bhej raha hai ya nahi.
const router=express.Router();

router.post("/",authMiddleware,createTask);

module.exports=router;
