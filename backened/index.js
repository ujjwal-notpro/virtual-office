const dns=require('node:dns');//node.js ka network codemein load kiya hai
dns.setServers(['8.8.8.8','8.8.4.4']);//apne blocked dns ko choodkr direct google dns use krr ha hai

const express=require("express");
const http = require("http");

const setupRoomHandlers = require("../realtime-backend/socket/rooms");
const setupSignalingHandlers = require("../realtime-backend/socket/signaling");
const setupChatHandlers = require("../realtime-backend/socket/chat");

const app=express();
const server = http.createServer(app);

const cors = require("cors");
const {Server} = require("socket.io");

const io=new Server(server,{
    cors: {
        origin: "*"
    }
});

io.on("connection",(socket) => {

    console.log("A user connected:", socket.id);

    setupRoomHandlers(io, socket);
    setupSignalingHandlers(io, socket);
    setupChatHandlers(io, socket);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });

});


app.use(express.json());//JSON format me frontend se jo data aayega,usko req.body ke andar read karne krega.

const PORT=process.env.PORT||3000;
require("./config/db");//folder ke nadr jo dbs hai ukso laod krega so that mongodb se communicate kr paye

const userRoutes=require("./routes/userRoutes");
const authRoutes=require("./routes/authRoutes");//authRoutes.js wali file ko index.js me lekar aao
const workspaceRoutes=require("./routes/workspaceRoutes");
const roomRoutes=require("./routes/roomRoutes");
const taskRoutes=require("./routes/taskRoutes");//Task ka route file server ke andar import ho raha hai.
const meetingRoutes=require("./routes/meetingRoutes");

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);//Jo request /api/auth se start hogi, usko authRoutes handle karega.
app.use("/api/workspaces",workspaceRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/tasks",taskRoutes);//se aane wali request taskRoutes ke paas jayegi.
app.use("/api/meetings",meetingRoutes);



app.get("/",(req,res)=>{
    res.send("chatmeet is running");
})

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});