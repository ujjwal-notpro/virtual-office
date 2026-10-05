const express=require("express");
const {createUser,resetPassword} = require("../controllers/userController");
//Matlab frontend/Postman se user ka data aayega, route usko controller tak bhejega, aur controller MongoDB me save karega.

const router=express.Router();

router.post("/",createUser);
router.post("/reset-password", resetPassword);

module.exports=router;
