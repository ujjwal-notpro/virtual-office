const Task=require("../models/Task");
const createTask=async(req,res)=>{
    try{
        const{title,description,status,assignedTo,workspace}=req.body;

        const task=await Task.create({
            title:title,
            description:description,
            status:status,
            assignedTo:assignedTo,
            workspace:workspace,
            createdBy:req.user.userId
        });
