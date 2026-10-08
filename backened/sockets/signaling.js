function setupSignalingHandlers(io,socket) {
    socket.on("offer", (data) => {
        const {target,offer} = data;
        io.to(target).emit("offer", {
            sender: socket.id,
            offer: offer
        });
    });

    socket.on("answer", (data) => {
         const {target,answer} = data;
         io.to(target).emit("answer", {
           sender: socket.id,
           answer: answer
       });
   });

   socket.on("ice-candidate", (data) => {
    const {target,candidate} = data;
    io.to(target).emit("ice-candidate", {
        sender: socket.id,
        candidate: candidate
    });
   });
}

module.exports = setupSignalingHandlers;

