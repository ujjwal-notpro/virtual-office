const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const setupRoomHandlers = require("./socket/rooms");
const setupSignalingHandlers = require("./socket/signaling");


const app=express();
const server=http.createServer(app);


//attaches socket.io to existing servers
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


app.use(cors());


app.get("/", (req,res) => {
    res.send("Real-time backend running");
});


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    setupRoomHandlers(io, socket);
    setupSignalingHandlers(io, socket);
    
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});