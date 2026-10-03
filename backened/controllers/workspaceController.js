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