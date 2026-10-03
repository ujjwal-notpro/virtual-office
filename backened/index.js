const dns=require('node:dns');//node.js ka network codemein load kiya hai
dns.setServers(['8.8.8.8','8.8.4.4']);//apne blocked dns ko choodkr direct google dns use krr ha hai

const express =require("express");
const app=express();

const PORT=3000;
require("./config/db");//folder ke nadr jo dbs hai ukso laod krega so that mongodb se communicate kr paye

app.get("/",(req,res)=>{
    res.send("chatmeet is running");
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});