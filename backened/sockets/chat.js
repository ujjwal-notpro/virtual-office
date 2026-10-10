
function setupChatHandlers(io,socket){
    socket.on("send-message",(data)=>{
        if(!data||typeof data.roomId!=="string"||!data.roomId.trim()||typeof data.message!=="string"||!data.message.trim()){
            return socket.emit("error-message",{message:"Room ID and message are required"});
        }
        const {roomId,message}=data;
        if(!socket.rooms.has(roomId)){
            return socket.emit("error-message",{message:"Join the room before sending messages"});
        }
        const cleanMessage=message.trim();
        io.to(roomId).emit("receive-message",{
            sender:socket.id,
            message:cleanMessage,
            roomId:roomId,
            timestamp:new Date().toISOString()
        });
    });
}
module.exports=setupChatHandlers;
