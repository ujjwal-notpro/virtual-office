const express=require("express");
const{createMeeting,getMeetings,getMeetingById}=require("../controllers/meetingController");

const authMiddleware=require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authMiddleware,createMeeting);//crete meeting
router.get("/",authMiddleware,getMeetings);//get all meeting
router.get("/:id",authMiddleware,getMeetingById);//get single meeting
module.exports=router;
