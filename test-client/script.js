const socket = io("http://localhost:8000");

let otherUserId = null;

socket.on("user-joined", (data) => {
    console.log("A user joined: ", data.socketId);
    otherUserId = data.socketId;
})

const localVideo = document.getElementById("localVideo");
const peerConnection = new RTCPeerConnection();

peerConnection.ontrack = (event) => {
    console.log("Remote track received");
    remoteVideo.srcObject = event.streams[0];
};

peerConnection.onicecandidate = (event) => {
    if (event.candidate && otherUserId) {
        socket.emit("ice-candidate", {
            target: otherUserId,
            candidate: event.candidate
        });
        console.log("ICE candidate sent");
    }
};

socket.on("ice-candidate", async (data) => {
    console.log("ICE candidate received from:", data.sender);

    await peerConnection.addIceCandidate(data.candidate);

    console.log("ICE candidate added");
});


async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    localVideo.srcObject = stream;

    stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
    });
}

startCamera();


async function createOffer() {
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    console.log("Created offer:", offer);

    socket.emit("offer", {
        target: otherUserId,
        offer: offer
    });
}



socket.on("connect", () => {
    console.log("Connected to server");
    console.log("My socket ID:", socket.id);

    document.getElementById("status").textContent =
        "Connected to server";

    socket.emit("join-room", "room123");
});

socket.on("user-joined", async (data) => {
    console.log("A user joined:", data.socketId);
    otherUserId = data.socketId;
    await createOffer();
});


socket.on("offer", async (data) => {

    console.log("Offer received from:", data.sender);

    otherUserId = data.sender;
    await peerConnection.setRemoteDescription(data.offer);
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log("Answer created:", answer);

        socket.emit("answer", {
        target: otherUserId,
        answer: answer
    });
})

socket.on("answer", async (data) => {

    console.log("Answer received from:", data.sender);

    await peerConnection.setRemoteDescription(data.answer);

    console.log("Remote description set");
});




socket.on("user-left", (data) => {
    console.log("A user left:", data.socketId);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");

    document.getElementById("status").textContent =
        "Disconnected from server";
});