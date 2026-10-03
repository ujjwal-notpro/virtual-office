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
            createdBy:req.user.userId,
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