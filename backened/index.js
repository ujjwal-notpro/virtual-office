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