
function setupSignalingHandlers(io,socket){
    socket.on("offer",(data)=>{
        if(!data||!data.target||!data.offer){
            return socket.emit("error-message",{message:"Target and offer are required"});
        }
        const targetSocket=io.sockets.sockets.get(data.target);
        if(!targetSocket){
            return socket.emit("error-message",{message:"Target user is not connected"});
        }
        const {target,offer}=data;
        io.to(target).emit("offer",{
            sender:socket.id,
            offer:offer
        });
    });
    socket.on("answer",(data)=>{
        if(!data||!data.target||!data.answer){
            return socket.emit("error-message",{message:"Target and answer are required"});
        }
        const targetSocket=io.sockets.sockets.get(data.target);
        if(!targetSocket){
            return socket.emit("error-message",{message:"Target user is not connected"});
        }
        const {target,answer}=data;
        io.to(target).emit("answer",{
            sender:socket.id,
            answer:answer
        });
    });
    socket.on("ice-candidate",(data)=>{
        if(!data||!data.target||!data.candidate){
            return socket.emit("error-message",{message:"Target and ICE candidate are required"});
        }
        const targetSocket=io.sockets.sockets.get(data.target);
        if(!targetSocket){
            return socket.emit("error-message",{message:"Target user is not connected"});
        }
        const {target,candidate}=data;
        io.to(target).emit("ice-candidate",{
            sender:socket.id,
            candidate:candidate
        });
    });
}
module.exports=setupSignalingHandlers;
