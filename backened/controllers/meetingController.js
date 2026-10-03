const Meeting=require("../models/Meeting");
const createMeeting = async (req, res) => {
    try{
        const{
            title,
            description,
            date,
            workspace,
            participants
        }=req.body;
        const meeting=await Meeting.create({
            title:title,
            description:description,
            date:date,
            workspace:workspace,
            createdBy:req.user.userId,//login token se current user ki ID lega, isliye hume body me
            participants:participants
        });

        res.status(201).json({
            message:"Meeting created successfully",
            meeting:meeting
        });

    }catch(error){

        res.status(500).json({
            message:"Meeting creation failed",
            error:error.message
        });
    }
};

const getMeetings=async(req,res)=>{//all meeting
    try{
        const{workspace}=req.query;

        const meetings=await Meeting.find({
            workspace:workspace
        })
        .populate("workspace")
        .populate("participants")
        .populate("createdBy");


        res.status(200).json({
            message:"Meetings fetched successfully",
            meetings:meetings
        });

    }catch(error){
        res.status(500).json({
            message:"Failed to fetch meetings",
            error:error.message
        });
    }
};

const getMeetingById = async(req,res)=>{//single meeting ke liye
    try{
        const {id}=req.params;
        const meeting=await Meeting.findById(id);
        if(!meeting){
            return res.status(404).json({
                message:"Meeting not found"
            });
        }
        res.status(200).json({
            message:"Meeting fetched successfully",
            meeting:meeting
        });
        }catch(error){
        res.status(500).json({
            message:"Failed to fetch meeting",
            error:error.message
        });
    }
};

module.exports = {createMeeting,getMeetings,getMeetingById};
