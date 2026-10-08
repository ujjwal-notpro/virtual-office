const mongoose=require("mongoose");
const taskSchema=new mongoose.Schema({
title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:["todo", "in-progress", "completed"],
        default:"todo"
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("Task",taskSchema);