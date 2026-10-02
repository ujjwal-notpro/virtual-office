const express =require("express");
const app=express();

const PORT=4800;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});