const Workspace=require("../models/Workspace");
const createWorkspace=async(req,res)=>{

    try{
        const{name,description}=req.body;
        const workspace=await Workspace.create({
            name:name,
            description:description,
            owner:req.user.userId,
            members:[req.user.userId]
        });
        res.status(201).json({
            message:"Workspace created successfully",
            workspace:workspace
        });
        }catch(error){
            res.status(500).json({
            message:"Workspace creation failed",
            error: error.message
        });
    }
};