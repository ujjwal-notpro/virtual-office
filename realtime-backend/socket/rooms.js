function setupRoomHandlers(io, socket) {

    socket.on("join-room", (roomId) => {

        socket.join(roomId);

        console.log(`${socket.id} joined room ${roomId}`);

        socket.to(roomId).emit("user-joined", {
            socketId: socket.id
        });
    });

    socket.on("leave-room", (roomId) => {
        socket.leave(roomId);
        console.log(`${socket.id} left room ${roomId}`);
    });

    socket.on("leave-room", (roomId) => {

        socket.leave(roomId);

        console.log(`${socket.id} left room ${roomId}`);

        socket.to(roomId).emit("user-left", {
            socketId: socket.id
        });
    });
}

module.exports = setupRoomHandlers;
