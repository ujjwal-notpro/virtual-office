import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  Signal,
  Users
} from 'lucide-react';
import { getSocket } from '../../services/socket';

export default function CallModal({
  isOpen,
  onClose,
  callType = 'video', // 'video' | 'audio'
  recipient = { name: 'Teammate', avatar: '', role: 'Member' },
  currentUser = { name: 'You' }
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('Connecting...'); // 'Connecting...' | 'Ringing...' | 'Connected'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteUserIdRef = useRef(null);
  const modalContainerRef = useRef(null);

  const roomId = `room-${recipient?.id || 'vow-call'}`;

  // Call timer
  useEffect(() => {
    let timer;
    if (isOpen && callStatus === 'Connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, callStatus]);

  // Format call duration (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // WebRTC & Media Initialization
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setCallDuration(0);
    setCallStatus('Connecting...');
    setIsVideoOff(callType === 'audio');
    setIsMuted(false);
    setIsScreenSharing(false);
    setRemoteUserJoined(false);

    const socket = getSocket();

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });
    peerConnectionRef.current = pc;

    // Handle remote track
    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote stream track');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteUserJoined(true);
        setCallStatus('Connected');
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && remoteUserIdRef.current && socket?.connected) {
        socket.emit('ice-candidate', {
          target: remoteUserIdRef.current,
          candidate: event.candidate
        });
      }
    };

    // Start local camera/microphone
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Connected state
        setCallStatus('Ringing...');

        // If socket is connected, join call room
        if (socket?.connected) {
          socket.emit('join-room', roomId);
        } else {
          // Local fallback simulation if socket is offline
          setTimeout(() => {
            if (mounted) setCallStatus('Connected');
          }, 1500);
        }
      } catch (err) {
        console.warn('Camera/Microphone access error:', err);
        setCallStatus('Connected (Audio Only)');
      }
    }

    startMedia();

    // Socket signaling events
    if (socket) {
      const handleUserJoined = async (data) => {
        console.log('[WebRTC] Remote user joined room:', data.socketId);
        remoteUserIdRef.current = data.socketId;
        setRemoteUserJoined(true);
        setCallStatus('Connected');

        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', {
            target: data.socketId,
            offer: offer
          });
        } catch (err) {
          console.error('Error creating WebRTC offer:', err);
        }
      };

      const handleOffer = async (data) => {
        console.log('[WebRTC] Received offer from:', data.sender);
        remoteUserIdRef.current = data.sender;
        setRemoteUserJoined(true);
        setCallStatus('Connected');

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', {
            target: data.sender,
            answer: answer
          });
        } catch (err) {
          console.error('Error handling WebRTC offer:', err);
        }
      };

      const handleAnswer = async (data) => {
        console.log('[WebRTC] Received answer from:', data.sender);
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error('Error handling WebRTC answer:', err);
        }
      };

      const handleIceCandidate = async (data) => {
        try {
          if (data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      };

      const handleUserLeft = () => {
        setRemoteUserJoined(false);
        setCallStatus('User Disconnected');
      };

      socket.on('user-joined', handleUserJoined);
      socket.on('offer', handleOffer);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handleIceCandidate);
      socket.on('user-left', handleUserLeft);

      return () => {
        mounted = false;
        socket.off('user-joined', handleUserJoined);
        socket.off('offer', handleOffer);
        socket.off('answer', handleAnswer);
        socket.off('ice-candidate', handleIceCandidate);
        socket.off('user-left', handleUserLeft);
        socket.emit('leave-room', roomId);
        cleanupCall();
      };
    }

    return () => {
      mounted = false;
      cleanupCall();
    };
  }, [isOpen, callType, recipient?.id]);

  const cleanupCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  // Toggle Microphone
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle Camera
  const toggleVideo = async () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      } else {
        // Add video track if didn't exist before
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const newTrack = videoStream.getVideoTracks()[0];
          localStreamRef.current.addTrack(newTrack);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(newTrack, localStreamRef.current);
          }
          setIsVideoOff(false);
        } catch (err) {
          console.warn('Unable to enable video:', err);
        }
      }
    }
  };

  // Screen Share Toggle
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        const senders = peerConnectionRef.current?.getSenders();
        const sender = senders?.find((s) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        screenTrack.onended = () => {
          stopScreenSharing();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.warn('Screen share canceled or failed:', err);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (localStreamRef.current && localVideoRef.current) {
      const originalVideoTrack = localStreamRef.current.getVideoTracks()[0];
      localVideoRef.current.srcObject = localStreamRef.current;
      const senders = peerConnectionRef.current?.getSenders();
      const sender = senders?.find((s) => s.track?.kind === 'video');
      if (sender && originalVideoTrack) {
        sender.replaceTrack(originalVideoTrack);
      }
    }
    setIsScreenSharing(false);
  };

  // Toggle Full Screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  // End Call
  const handleEndCall = () => {
    cleanupCall();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div
        ref={modalContainerRef}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[720px] transition-all"
      >
        {/* Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 h-16 px-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{recipient.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-[10px] font-semibold text-zinc-300">
                  {callType === 'video' ? 'HD Video Call' : 'Encrypted Voice Call'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                  {roomId}
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>{callStatus}</span>
                {callStatus === 'Connected' && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatTime(callDuration)}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Video / Audio Stage */}
        <div className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
          {/* Remote Video (Full Screen Stage) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={isSpeakerMuted}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              remoteUserJoined && !isVideoOff ? 'opacity-100' : 'opacity-0 absolute'
            }`}
          />

          {/* Audio Avatar / Fallback Placeholder when remote video is off or audio-only */}
          {(!remoteUserJoined || isVideoOff || callType === 'audio') && (
            <div className="text-center space-y-6 animate-fadeIn z-10">
              <div className="relative mx-auto w-32 h-32">
                {/* Pulsing rings for active voice connection */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
                <div className="absolute -inset-3 rounded-full bg-emerald-500/10 animate-pulse" />
                <img
                  src={
                    recipient.avatar ||
                    'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=600&auto=format&fit=crop&q=60'
                  }
                  alt={recipient.name}
                  className="relative w-full h-full rounded-full object-cover border-4 border-zinc-800 shadow-2xl ring-2 ring-emerald-500/50"
                />
                <span className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-500 ring-4 ring-zinc-950">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                </span>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{recipient.name}</h2>
                <p className="text-sm text-zinc-400 font-medium">{recipient.role || 'Team Member'}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{callStatus}</span>
                  {callStatus === 'Connected' && (
                    <span className="font-mono text-emerald-400 font-bold ml-1">{formatTime(callDuration)}</span>
                  )}
                </div>
              </div>

              {/* Audio Wave Visualizer Bars */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height * 0.4}px` }}
                    className={`w-1 rounded-full bg-emerald-400/80 transition-all duration-300 ${
                      callStatus === 'Connected' ? 'animate-pulse' : 'opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Local Camera (Floating Picture-in-Picture) */}
          <div className="absolute bottom-24 right-6 w-48 h-32 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 shadow-2xl z-20 group transition-all duration-300 hover:scale-105">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 gap-1">
                <VideoOff className="w-6 h-6" />
                <span className="text-[10px] font-semibold">Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-[10px] font-semibold text-white">
              {currentUser.name || 'You'} {isMuted && '(Muted)'}
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="h-22 px-6 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800/80 flex items-center justify-center gap-4 z-30">
          {/* Mute Mic */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-zinc-800/90 border-zinc-700 hover:bg-zinc-700 text-white'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isVideoOff
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-zinc-800/90 border-zinc-700 hover:bg-zinc-700 text-white'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isScreenSharing
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-zinc-800/90 border-zinc-700 hover:bg-zinc-700 text-white'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          {/* Speaker Mute */}
          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isSpeakerMuted
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-zinc-800/90 border-zinc-700 hover:bg-zinc-700 text-white'
            }`}
            title={isSpeakerMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.6)] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
            <span>Leave Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
