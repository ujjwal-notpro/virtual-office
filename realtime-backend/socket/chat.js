function setupChatHandlers(io,socket) {
    socket.on("send-message", (data) => {
        const {roomId,message} = data;

        // The sender already adds its message optimistically in the client.
        // Broadcast only to the other sockets in this room to avoid a duplicate.
        socket.to(roomId).emit("receive-message", {
            sender: socket.id,
            message: message
        });
    });
}

module.exports = setupChatHandlers;
