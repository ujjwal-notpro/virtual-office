const express = require("express");
const{createRoom}=require("../controllers/roomController");//Room create karne wala function controller se la rahe hain.
const authMiddleware = require("../middlewares/authMiddleware");//JWT checking ke liye middleware la rahe hain.

const router = express.Router();

router.post("/", authMiddleware, createRoom);
module.exports = router;