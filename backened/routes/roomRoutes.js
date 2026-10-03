const express = require("express");
const{createRoom}=require("../controllers/roomController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createRoom);
module.exports = router;