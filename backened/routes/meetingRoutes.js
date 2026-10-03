const express=require("express");
const{createMeeting,getMeetings}=require("../controllers/meetingController");

const authMiddleware=require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authMiddleware,createMeeting);//crete meeting
router.get("/",authMiddleware,getMeetings);//get meeting

module.exports=router;
