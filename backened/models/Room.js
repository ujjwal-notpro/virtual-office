const mongoose=require("mongoose");
const roomSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        default:"general"
    },
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("Room",roomSchema);

