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
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model("Meeting",meetingSchema);
