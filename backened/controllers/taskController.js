const Task=require("../models/Task");
const createTask=async(req,res)=>{
    try{
        const{title,description,status,assignedTo,workspace}=req.body;//frontend se task ki information le rahe hain hm
        

        const task=await Task.create({
            title:title,
            description:description,
            status:status,
            assignedTo:assignedTo,
            workspace:workspace,
            createdBy:req.user.userId
        });
        res.status(201).json({
            message:"Task created successfully",
            task:task
        });
    }catch(error){
        res.status(500).json({
            message:"Task creation failed",
            error:error.message
        });
    }
};
module.exports = {createTask};
