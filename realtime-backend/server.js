const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const setupRoomHandlers = require("./socket/rooms");
const setupSignalingHandlers = require("./socket/signaling");
const setupChatHandlers = require("./socket/chat");

const allowedOrigins = (process.env.FRONTEND_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        // Requests without an Origin header are useful for local health checks.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST"],
};

const app=express();
const server=http.createServer(app);


//attaches socket.io to existing servers
const io = new Server(server, {
    cors: corsOptions
});


app.use(cors(corsOptions));


app.get("/", (req,res) => {
    res.send("Real-time backend running");
});


io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    setupRoomHandlers(io, socket);
    setupSignalingHandlers(io, socket);
    setupChatHandlers(io, socket);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
