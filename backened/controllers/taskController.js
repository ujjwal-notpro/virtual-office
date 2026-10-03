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
            createdBy:req.user.userId //JWT se currently logg-in user ki ID automatically creator mein save ho jayegi
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


const getTasks = async (req, res)=>{
     try{

        const{workspace}=req.query;
        const tasks=await Task.find({
            workspace:workspace
        });
        res.status(200).json({
            message:"Tasks fetched successfully",
            tasks:tasks
        });
        }catch(error) {
        res.status(500).json({
            message:"Failed to fetch tasks",
            error:error.message
        });
    }
};

const updateTask=async(req,res)=>{
    try{
        const{id}= req.params;//URL se task ki ID lega.
        const {status}=req.body;//Body se naya status lega.

        const task=await Task.findByIdAndUpdate(id,{status:status },{new:true});
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

const createTask=async(req,res)=>{
    try{
        const{
            title,
            description,
            status,
            assignedTo,
            workspace
        }=req.body;


module.exports = {createTask,getTasks,updateTask};
