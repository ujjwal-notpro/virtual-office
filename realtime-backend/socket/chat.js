function setupChatHandlers(io,socket) {
    socket.on("send-message", (data) => {
        const {roomId,message} = data;

        io.to(roomId).emit("receive-message", {
            sender: socket.id,
            message: message
        });
    });
}

module.exports = setupChatHandlers;