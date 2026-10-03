const express=require("express");
const{createMeeting,getMeetings}=require("../controllers/meetingController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
