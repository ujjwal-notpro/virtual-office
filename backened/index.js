const dns=require('node:dns');//node.js ka network codemein load kiya hai
dns.setServers(['8.8.8.8','8.8.4.4']);//apne blocked dns ko choodkr direct google dns use krr ha hai

const express =require("express");
const app=express();

app.use(express.json());//JSON format me frontend se jo data aayega,usko req.body ke andar read karne krega.

const PORT=3000;
require("./config/db");//folder ke nadr jo dbs hai ukso laod krega so that mongodb se communicate kr paye

const userRoutes=require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");//authRoutes.js wali file ko index.js me lekar aao

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);//Jo request /api/auth se start hogi, usko authRoutes handle karega.


app.get("/",(req,res)=>{
    res.send("chatmeet is running");
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});