const express=require("express");
const {createUser} = require("../controllers/userController");
//Matlab frontend/Postman se user ka data aayega, route usko controller tak bhejega, aur controller MongoDB me save karega.

const router=express.Router();

router.post("/",createUser);

module.exports=router;
