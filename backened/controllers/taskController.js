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

const getTasks=async(req,res)=>{
    try{
        const{workspace}=req.query;

        const filter=workspace
            ?{workspace:workspace}
            :{createdBy:req.user.userId};

        const tasks=await Task.find(filter);

        res.status(200).json({
            message:"Tasks fetched successfully",
            tasks:tasks
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch tasks",
            error:error.message
        });
    }
};

const updateTask=async(req,res)=>{
    try{
        const{id}=req.params;
        const{status}=req.body;

        const task=await Task.findByIdAndUpdate(id,{status:status},{new:true});

        if(!task){
            return res.status(404).json({
                message:"Task not found"
            });
        }

        res.status(200).json({
            message:"Task updated successfully",
            task:task
        });
    }catch(error){
        res.status(500).json({
            message:"Task update failed",
            error:error.message
        });
    }
};

const deleteTask=async(req,res)=>{
    try{
        const{id}=req.params;

        const task=await Task.findByIdAndDelete(id);

        if(!task){
            return res.status(404).json({
                message:"Task not found"
            });
        }

        res.status(200).json({
            message:"Task deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"Task deletion failed",
            error:error.message
        });
    }
};

module.exports={createTask,getTasks,updateTask,deleteTask};