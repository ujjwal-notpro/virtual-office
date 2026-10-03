const express = require("express");
const {createTask}=require("../controllers/taskController");

const authMiddleware=require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authMiddleware,createTask);

module.exports = router;
