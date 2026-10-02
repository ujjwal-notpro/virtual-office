const express =require("express");
const app=express();

const PORT=4800;

app.get("/",(req,res)=>{
    res.send("chatmeet is running");
})
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});