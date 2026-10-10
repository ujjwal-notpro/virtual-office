
const dns=require("node:dns");//Node.js ke DNS module ko load kiya hai.
dns.setServers(["8.8.8.8","8.8.4.4"]);//DNS lookup ke liye Google DNS servers set kiye hain.
require("dotenv").config();//.env file ke environment variables ko load karta hai.
const express=require("express");
const cors=require("cors");//Frontend se aane wali cross-origin requests ko handle karne ke liye.
const http=require("http");//Express app ka HTTP server banane ke liye.
const {Server}=require("socket.io");//Socket.IO server ko load kiya hai.
const connectDB=require("./config/db");//MongoDB connection function ko load kiya hai.
const app=express();
const server=http.createServer(app);//Ek HTTP server banaya hai jisme APIs aur Socket.IO dono chalenge.
const allowedOrigins=(process.env.CLIENT_URL||"http://localhost:5173").split(",").map(origin=>origin.trim());//Frontend ke allowed URLs ko load karta hai.
const io=new Server(server,{
    cors:{
        origin:allowedOrigins,//Configured frontend origins ko allow karta hai.
        methods:["GET","POST"]
    }
});

app.use(cors({origin:allowedOrigins}));//Frontend ko configured origins se backend APIs access karne deta hai.
app.use(express.json());//JSON data ko read karke req.body mein available karata hai.
app.use(express.static("public"));//Public folder ki HTML, CSS aur JavaScript files browser ko serve karta hai.
const PORT=process.env.PORT||3000;//Deployment par PORT mile toh use karega, warna 3000.
//Backend 1 ke API route files ko load kiya hai.
const userRoutes=require("./routes/userRoutes");
const authRoutes=require("./routes/authRoutes");
const workspaceRoutes=require("./routes/workspaceRoutes");
const roomRoutes=require("./routes/roomRoutes");
const taskRoutes=require("./routes/taskRoutes");
const meetingRoutes=require("./routes/meetingRoutes");
//Har API prefix ki request uski corresponding route file handle karegi.
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/workspaces",workspaceRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/meetings",meetingRoutes);
//Backend 2 ke Socket.IO handlers ko load kiya hai.
const setupRoomHandlers=require("./sockets/rooms");//Meeting rooms aur participants ke events.
const setupSignalingHandlers=require("./sockets/signaling");//WebRTC offer, answer aur ICE candidate events.
const setupChatHandlers=require("./sockets/chat");//Realtime chat ke events.
//Jab koi user Socket.IO se connect hota hai, tab ye callback chalta hai.
io.on("connection",(socket)=>{
    console.log("A user connected:",socket.id);//Connected user ki unique socket ID print hoti hai.
    setupRoomHandlers(io,socket);//Room joining aur room-related events register karta hai.
    setupSignalingHandlers(io,socket);//WebRTC signaling events register karta hai.
    setupChatHandlers(io,socket);//Chat events register karta hai.
    socket.on("disconnect",()=>{
        console.log("A user disconnected:",socket.id);//User disconnect hone par log print hota hai.
    });
});
//MongoDB connect hone ke baad HTTP server start hota hai.
const startServer=async()=>{
    try{
        await connectDB();//MongoDB connection complete hone ka wait karta hai.
        server.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        });
    }catch(error){
        console.log("Server startup failed",error.message);
        process.exit(1);
    }
};
startServer();
