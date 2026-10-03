const mongoose=require("mongoose");
const meetingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    date:{
        type:Date,
        required:true
    },
    workspace:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
