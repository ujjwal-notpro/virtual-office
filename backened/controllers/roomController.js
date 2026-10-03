const Room = require("../models/Room");
const createRoom = async(req,res) => {
    try{
        const{name,type,workspace}=req.body;

        const room=await Room.create({
            name:name,
            type:type,
            workspace:workspace
        });

        res.status(201).json({
            message:"Room created successfully",
            room:room
        });
        }catch(error){
        res.status(500).json({
            message:"Room creation failed",
            error:error.message
        });
    }
};
module.exports = {createRoom};