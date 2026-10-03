const express = require("express");
const {createTask,getTasks}=require("../controllers/taskController");

const authMiddleware=require("../middleware/authMiddleware");//Check karega ki user login/token ke saath request bhej raha hai ya nahi.
const router=express.Router();

router.post("/",authMiddleware,createTask);//create task ke liye
router.get("/", authMiddleware, getTasks);//get task ke liye

module.exports=router;
