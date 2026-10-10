
function setupRoomHandlers(io,socket){
    socket.on("join-room",(roomId)=>{
        if(!roomId||typeof roomId!=="string"||!roomId.trim()){
            return socket.emit("error-message",{message:"Valid room ID is required"});
        }
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit("user-joined",{socketId:socket.id});
        const participants=io.sockets.adapter.rooms.get(roomId);
        io.to(roomId).emit("room-participants",{
            roomId:roomId,
            participants:participants?[...participants]:[]
        });
    });
    socket.on("leave-room",(roomId)=>{
        if(!roomId||typeof roomId!=="string"||!roomId.trim()){
            return socket.emit("error-message",{message:"Valid room ID is required"});
        }
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
        socket.to(roomId).emit("user-left",{socketId:socket.id});
        const participants=io.sockets.adapter.rooms.get(roomId);
        io.to(roomId).emit("room-participants",{
            roomId:roomId,
            participants:participants?[...participants]:[]
        });
    });
    socket.on("disconnecting",()=>{
        for(const roomId of socket.rooms){
            if(roomId===socket.id)continue;
            socket.to(roomId).emit("user-left",{socketId:socket.id});
            const participants=io.sockets.adapter.rooms.get(roomId);
            const remaining=participants?[...participants].filter(id=>id!==socket.id):[];
            socket.to(roomId).emit("room-participants",{
                roomId:roomId,
                participants:remaining
            });
        }
    });
}
module.exports=setupRoomHandlers;
