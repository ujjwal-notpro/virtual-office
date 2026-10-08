import { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  Users,
  MessageSquare,
  Hand,
  Maximize2,
  Minimize2,
  Check,
  Send,
  X,
  Share2,
  Layers,
  UserPlus,
} from 'lucide-react';
import { connectSocket } from '../../services/socket';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

function createSyntheticMediaStream(name = 'Guest') {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let frame = 0;
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'];
  const colorIndex = Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % colors.length;
  const themeColor = colors[colorIndex];

  const draw = () => {
    frame++;

    ctx.fillStyle = '#111115';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(320, 210, 20, 320, 210, 220);
    grad.addColorStop(0, themeColor + '25');
    grad.addColorStop(1, '#11111500');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const radius = 62 + Math.sin(frame * 0.08) * 4;
    ctx.beginPath();
    ctx.arc(320, 200, radius, 0, Math.PI * 2);
    ctx.strokeStyle = themeColor + '88';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(320, 200, 52, 0, Math.PI * 2);
    ctx.fillStyle = themeColor;
    ctx.fill();

    ctx.font = 'bold 44px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((name || 'U').charAt(0).toUpperCase(), 320, 200);

    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#f4f4f5';
    ctx.fillText(name, 320, 290);

    const barCount = 7;
    const startX = 320 - ((barCount * 12) / 2);
    for (let i = 0; i < barCount; i++) {
      const h = 6 + Math.abs(Math.sin((frame * 0.12) + i)) * 16;
      ctx.fillStyle = themeColor;
      ctx.beginPath();
      ctx.roundRect(startX + (i * 12), 325 - (h / 2), 6, h, 3);
      ctx.fill();
    }
  };

  const animInterval = setInterval(draw, 1000 / 25);
  const videoStream = canvas.captureStream(25);
  const videoTrack = videoStream.getVideoTracks()[0];

  let audioTrack = null;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    audioTrack = dest.stream.getAudioTracks()[0];
  } catch (e) {
    console.warn('AudioContext error:', e);
  }

  const tracks = [videoTrack];
  if (audioTrack) tracks.push(audioTrack);
  const stream = new MediaStream(tracks);

  videoTrack.onended = () => {
    clearInterval(animInterval);
  };

  return stream;
}

function RemoteTile({ peer }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      if (videoRef.current.srcObject !== peer.stream) {
        videoRef.current.srcObject = peer.stream;
      }
      videoRef.current.play().catch((e) => {
        console.warn('Remote video play error:', e);
      });
    }
  }, [peer.stream]);

  const hasVideoTrack = !!peer.stream && peer.stream.getVideoTracks().length > 0;
  const showVideo = hasVideoTrack && !peer.isVideoOff;

  return (
    <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center min-h-[160px] animate-fadeIn">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ visibility: showVideo ? 'visible' : 'hidden' }}
      />

      {!showVideo && (
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 rounded-full bg-zinc-700 text-white font-bold text-xl flex items-center justify-center border border-zinc-600 shadow-md">
            {(peer.name || 'G').charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-zinc-300 font-medium">{peer.name || 'Guest'}</span>
          {peer.connState && peer.connState !== 'connected' && (
            <span className="text-[10px] text-amber-400 capitalize">
              {peer.connState === 'failed' ? 'Reconnecting...' : `${peer.connState}...`}
            </span>
          )}
        </div>
      )}

      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium text-white shadow">
          {peer.name || 'Guest'}
        </div>
        <div className="flex items-center gap-1">
          {peer.isHandRaised && (
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow">
              <Hand className="w-3.5 h-3.5" />
            </div>
          )}
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shadow ${peer.isMuted ? 'bg-red-500' : 'bg-emerald-600'
              }`}
          >
            {peer.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeetingRoom({
  meetingConfig = {},
  onLeave,
  currentUser = { name: 'You' },
}) {
  const {
    meetingCode = 'all-rooms-sync',
    roomTopic = 'All-Rooms Company Conference',
    userName = currentUser?.name || 'You',
    isMicOn: initialMic = true,
    isVideoOn: initialVideo = true,
  } = meetingConfig;

  const myPeerIdRef = useRef(
    `peer_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`
  );
  const myPeerId = myPeerIdRef.current;

  const [isMuted, setIsMuted] = useState(!initialMic);
  const [isVideoOff, setIsVideoOff] = useState(!initialVideo);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeTabPanel, setActiveTabPanel] = useState(null);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [mediaReady, setMediaReady] = useState(false);
  const [remotePeers, setRemotePeers] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [joinNotification, setJoinNotification] = useState(null);

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const roomContainerRef = useRef(null);
  const chatBottomRef = useRef(null);
  const peersRef = useRef(new Map());
  const broadcastChannelRef = useRef(null);
  const stateRef = useRef({ isMuted, isVideoOff, isHandRaised, isScreenSharing, userName, mediaReady: false });

  useEffect(() => {
    stateRef.current = { isMuted, isVideoOff, isHandRaised, isScreenSharing, userName, mediaReady };
  }, [isMuted, isVideoOff, isHandRaised, isScreenSharing, userName, mediaReady]);

  const cleanCode = (meetingCode || 'all-rooms-sync').trim().replace(/[^a-zA-Z0-9-_]/g, '-');
  const roomId = `meeting-${cleanCode}`;
  const remoteList = Object.values(remotePeers);
  const allParticipantsCount = remoteList.length + 1;

  useEffect(() => {
    const timer = setInterval(() => setMeetingDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const notifyPeerEvent = (name, eventType = 'joined') => {
    setJoinNotification({ name: name || 'A participant', type: eventType });
    setTimeout(() => setJoinNotification(null), 3500);
  };

  useEffect(() => {
    let cancelled = false;

    const channelName = `vow_channel_${cleanCode}`;
    let bc = null;
    try {
      bc = new BroadcastChannel(channelName);
      broadcastChannelRef.current = bc;
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    const socket = connectSocket();

    const emitSignal = (payload) => {
      const fullMsg = { ...payload, roomId, sender: myPeerId };
      if (bc) {
        try {
          bc.postMessage(fullMsg);
        } catch (e) {
          console.warn('BC postMessage error:', e);
        }
      }
      if (socket?.connected) {
        socket.emit('meeting:signal', fullMsg);
      }
    };

    const updatePeer = (id, patch) => {
      setRemotePeers((prev) => {
        const base = prev[id] || {
          id,
          name: 'Guest',
          stream: null,
          isMuted: false,
          isVideoOff: false,
          isHandRaised: false,
          connState: 'connecting',
        };
        return { ...prev, [id]: { ...base, ...patch } };
      });
    };

    const closePeer = (id, notify = true) => {
      const entry = peersRef.current.get(id);
      if (entry) {
        if (notify && entry.name) {
          notifyPeerEvent(entry.name, 'left');
        }
        entry.pc.ontrack = null;
        entry.pc.onicecandidate = null;
        entry.pc.onconnectionstatechange = null;
        try {
          entry.pc.close();
        } catch (e) {
          console.warn('PC close error:', e);
        }
        peersRef.current.delete(id);
      }
      setRemotePeers((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };

    const createPeerConnection = (targetPeerId, targetName = 'Guest') => {
      const existing = peersRef.current.get(targetPeerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      const remoteStream = new MediaStream();
      const entry = {
        pc,
        pendingIce: [],
        remoteStream,
        name: targetName,
      };
      peersRef.current.set(targetPeerId, entry);

      const localStream = localStreamRef.current;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, localStream);
          } catch (e) {
            console.warn('Add track error:', e);
          }
        });
      }

      pc.ontrack = (event) => {
        event.streams[0]?.getTracks().forEach((track) => {
          if (!entry.remoteStream.getTracks().includes(track)) {
            entry.remoteStream.addTrack(track);
          }
        });
        if (event.track && !entry.remoteStream.getTracks().includes(event.track)) {
          entry.remoteStream.addTrack(event.track);
        }
        updatePeer(targetPeerId, { stream: entry.remoteStream, connState: 'connected' });
        event.track.onunmute = () => {
          updatePeer(targetPeerId, { stream: entry.remoteStream, connState: 'connected' });
        };
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          emitSignal({
            action: 'candidate',
            target: targetPeerId,
            candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        updatePeer(targetPeerId, { connState: state });
        if (state === 'connected') {
          setConnectionStatus('connected');
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          updatePeer(targetPeerId, { connState: 'connected' });
        }
      };

      return entry;
    };

    const flushPendingIce = async (entry) => {
      while (entry.pendingIce.length > 0) {
        const candidate = entry.pendingIce.shift();
        try {
          await entry.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('addIceCandidate error:', err);
        }
      }
    };

    const startOffer = async (targetPeerId, targetName) => {
      const entry = createPeerConnection(targetPeerId, targetName);
      const { pc } = entry;

      ['audio', 'video'].forEach((kind) => {
        const hasKind = pc.getTransceivers().some((t) => t.receiver.track.kind === kind);
        if (!hasKind) {
          try {
            pc.addTransceiver(kind, { direction: 'sendrecv' });
          } catch (e) {
            console.warn('addTransceiver error:', e);
          }
        }
      });

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        emitSignal({
          action: 'offer',
          target: targetPeerId,
          sdp: pc.localDescription,
          name: stateRef.current.userName,
          state: {
            isMuted: stateRef.current.isMuted,
            isVideoOff: stateRef.current.isVideoOff && !stateRef.current.isScreenSharing,
            isHandRaised: stateRef.current.isHandRaised,
          },
        });
      } catch (err) {
        console.error('createOffer error:', err);
      }
    };

    const handleIncomingMessage = async (msg) => {
      if (!msg || msg.sender === myPeerId) return;

      const { action, sender, target, user, state, sdp, candidate, message: chatMsg } = msg;

      if (target && target !== myPeerId) return;

      if (action === 'hello') {
        updatePeer(sender, {
          name: user?.name || 'Guest',
          isMuted: !!user?.isMuted,
          isVideoOff: !!user?.isVideoOff,
          isHandRaised: !!user?.isHandRaised,
        });
        notifyPeerEvent(user?.name || 'Guest', 'joined');

        emitSignal({
          action: 'welcome',
          target: sender,
          user: {
            name: stateRef.current.userName,
            isMuted: stateRef.current.isMuted,
            isVideoOff: stateRef.current.isVideoOff && !stateRef.current.isScreenSharing,
            isHandRaised: stateRef.current.isHandRaised,
          },
        });

        if (myPeerId > sender) {
          await startOffer(sender, user?.name);
        }
      } else if (action === 'welcome') {
        updatePeer(sender, {
          name: user?.name || 'Guest',
          isMuted: !!user?.isMuted,
          isVideoOff: !!user?.isVideoOff,
          isHandRaised: !!user?.isHandRaised,
        });

        if (myPeerId > sender) {
          await startOffer(sender, user?.name);
        }
      } else if (action === 'offer') {
        updatePeer(sender, {
          name: msg.name || 'Guest',
          isMuted: !!state?.isMuted,
          isVideoOff: !!state?.isVideoOff,
          isHandRaised: !!state?.isHandRaised,
        });

        const entry = createPeerConnection(sender, msg.name);
        const { pc } = entry;

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          pc.getTransceivers().forEach((t) => {
            if (t.direction === 'recvonly') t.direction = 'sendrecv';
          });
          await flushPendingIce(entry);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          emitSignal({
            action: 'answer',
            target: sender,
            sdp: pc.localDescription,
            name: stateRef.current.userName,
            state: {
              isMuted: stateRef.current.isMuted,
              isVideoOff: stateRef.current.isVideoOff && !stateRef.current.isScreenSharing,
              isHandRaised: stateRef.current.isHandRaised,
            },
          });
        } catch (err) {
          console.error('Handling offer error:', err);
        }
      } else if (action === 'answer') {
        const entry = peersRef.current.get(sender);
        if (!entry) return;

        try {
          await entry.pc.setRemoteDescription(new RTCSessionDescription(sdp));
          await flushPendingIce(entry);
        } catch (err) {
          console.error('Handling answer error:', err);
        }
      } else if (action === 'candidate') {
        const entry = peersRef.current.get(sender);
        if (!entry) return;

        if (entry.pc.remoteDescription && entry.pc.remoteDescription.type) {
          try {
            await entry.pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.warn('addIceCandidate error:', e);
          }
        } else {
          entry.pendingIce.push(candidate);
        }
      } else if (action === 'state') {
        updatePeer(sender, {
          name: state?.name,
          isMuted: !!state?.isMuted,
          isVideoOff: !!state?.isVideoOff,
          isHandRaised: !!state?.isHandRaised,
        });
      } else if (action === 'chat') {
        if (chatMsg) {
          setChatMessages((prev) => [...prev, { ...chatMsg, isMe: false }]);
        }
      } else if (action === 'leave') {
        closePeer(sender, true);
      }
    };

    if (bc) {
      bc.onmessage = (event) => {
        handleIncomingMessage(event.data);
      };
    }

    if (socket) {
      socket.on('meeting:signal', handleIncomingMessage);
    }

    async function initMediaAndSignaling() {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (err) {
        console.warn('Hardware camera/mic not directly accessible (or locked by another tab), creating virtual camera fallback:', err);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err2) {
          console.warn('Audio only also locked:', err2);
        }

        if (!stream || stream.getVideoTracks().length === 0) {
          stream = createSyntheticMediaStream(userName);
        }
      }

      if (cancelled) {
        stream?.getTracks().forEach((t) => t.stop());
        return;
      }

      if (stream) {
        stream.getAudioTracks().forEach((t) => {
          t.enabled = !stateRef.current.isMuted;
        });
        stream.getVideoTracks().forEach((t) => {
          t.enabled = !stateRef.current.isVideoOff;
        });
        localStreamRef.current = stream;
      }

      setMediaReady(true);
      setConnectionStatus('connected');

      emitSignal({
        action: 'hello',
        user: {
          name: stateRef.current.userName,
          isMuted: stateRef.current.isMuted,
          isVideoOff: stateRef.current.isVideoOff && !stateRef.current.isScreenSharing,
          isHandRaised: stateRef.current.isHandRaised,
        },
      });

      if (socket?.connected) {
        socket.emit('meeting:join', {
          roomId,
          user: {
            name: stateRef.current.userName,
            isMuted: stateRef.current.isMuted,
            isVideoOff: stateRef.current.isVideoOff,
          },
        });
      }
    }

    initMediaAndSignaling();

    const heartbeat = setInterval(() => {
      if (!cancelled) {
        emitSignal({
          action: 'state',
          state: {
            name: stateRef.current.userName,
            isMuted: stateRef.current.isMuted,
            isVideoOff: stateRef.current.isVideoOff && !stateRef.current.isScreenSharing,
            isHandRaised: stateRef.current.isHandRaised,
          },
        });
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(heartbeat);

      emitSignal({ action: 'leave' });
      if (socket?.connected) {
        socket.emit('meeting:leave', { roomId });
      }

      if (bc) {
        bc.close();
      }

      if (socket) {
        socket.off('meeting:signal', handleIncomingMessage);
      }

      peersRef.current.forEach((entry) => {
        try {
          entry.pc.close();
        } catch (e) {
          console.warn(e);
        }
      });
      peersRef.current.clear();

      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    };
  }, [cleanCode, roomId, myPeerId, userName]);

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [mediaReady, isVideoOff]);

  useEffect(() => {
    if (isScreenSharing && screenVideoRef.current && screenStreamRef.current) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing]);

  useEffect(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !isMuted;
    });
  }, [isMuted]);

  useEffect(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !isVideoOff;
    });
  }, [isVideoOff]);

  useEffect(() => {
    const payload = {
      action: 'state',
      roomId,
      sender: myPeerId,
      state: {
        name: userName,
        isMuted,
        isVideoOff: isVideoOff && !isScreenSharing,
        isHandRaised,
      },
    };

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage(payload);
      } catch (e) {
        console.warn(e);
      }
    }

    const socket = connectSocket();
    if (socket?.connected) {
      socket.emit('meeting:state', payload.state);
      socket.emit('meeting:signal', payload);
    }
  }, [isMuted, isVideoOff, isHandRaised, isScreenSharing, userName, myPeerId, roomId]);

  useEffect(() => {
    if (activeTabPanel === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTabPanel]);

  const toggleMic = () => setIsMuted((prev) => !prev);
  const toggleVideo = () => setIsVideoOff((prev) => !prev);

  const replaceOutgoingVideo = (track) => {
    peersRef.current.forEach(({ pc }) => {
      const transceiver = pc.getTransceivers().find((t) => t.sender.track?.kind === 'video' || t.receiver.track?.kind === 'video');
      if (transceiver && transceiver.sender) {
        transceiver.sender.replaceTrack(track).catch((e) => console.warn(e));
      }
    });
  };

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setIsScreenSharing(false);
    replaceOutgoingVideo(localStreamRef.current?.getVideoTracks()[0] || null);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = stream;
      const screenTrack = stream.getVideoTracks()[0];
      screenTrack.onended = stopScreenShare;
      replaceOutgoingVideo(screenTrack);
      setIsScreenSharing(true);
    } catch (err) {
      console.warn('Screen share canceled or failed:', err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      roomContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: userName || 'You',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, { ...newMsg, isMe: true }]);
    setInputMessage('');

    const payload = {
      action: 'chat',
      roomId,
      sender: myPeerId,
      message: newMsg,
    };

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage(payload);
      } catch (err) {
        console.warn(err);
      }
    }

    const socket = connectSocket();
    if (socket?.connected) {
      socket.emit('meeting:signal', payload);
      socket.emit('meeting:message', { roomId, message: newMsg });
    }
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/dashboard?room=${encodeURIComponent(cleanCode)}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      ref={roomContainerRef}
      className="relative w-full h-full flex flex-col bg-zinc-950 text-white select-none overflow-hidden"
    >

      {joinNotification && (
        <div className="absolute top-16 left-6 z-50 bg-zinc-900/95 border border-emerald-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-fadeIn">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
            <UserPlus className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-emerald-400">{joinNotification.name}</span>{' '}
            {joinNotification.type === 'joined' ? 'joined the call' : 'left the call'}
          </div>
        </div>
      )}

      <header className="h-14 shrink-0 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-bold flex items-center justify-center text-xs shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">{roomTopic}</h2>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {allParticipantsCount} in call
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{cleanCode}</span>
              <span>•</span>
              <span>{formatDuration(meetingDuration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          <button
            onClick={copyMeetingLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer transition-colors shadow-sm"
            title="Copy Invite Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Invite Link</span>
              </>
            )}
          </button>

          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer shadow-md transition-all active:scale-95"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-center items-center">

          {isScreenSharing && (
            <div className="w-full max-w-4xl aspect-video mb-3 rounded-xl overflow-hidden bg-black border border-zinc-700 relative shadow-2xl">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-zinc-900/90 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow">
                <ScreenShare className="w-3.5 h-3.5 text-amber-500" />
                <span>Presenting your screen</span>
              </div>
            </div>
          )}

          <div
            className={`w-full max-w-5xl grid gap-3 h-full max-h-[75vh] auto-rows-fr ${allParticipantsCount <= 1
                ? 'grid-cols-1'
                : allParticipantsCount <= 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : allParticipantsCount <= 4
                    ? 'grid-cols-2'
                    : allParticipantsCount <= 6
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}
          >

            <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center min-h-[160px]">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                style={{ visibility: isVideoOff ? 'hidden' : 'visible' }}
              />
              {isVideoOff && (
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-bold text-xl flex items-center justify-center shadow-lg">
                    {userName ? userName.charAt(0).toUpperCase() : 'Y'}
                  </div>
                  <span className="text-xs text-zinc-300 font-medium">{userName} (You)</span>
                </div>
              )}

              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                <div className="bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 shadow">
                  <span>{userName} (You)</span>
                </div>

                <div className="flex items-center gap-1">
                  {isHandRaised && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow">
                      <Hand className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shadow ${isMuted ? 'bg-red-500' : 'bg-emerald-600'
                      }`}
                  >
                    {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>

            {remoteList.map((peer) => (
              <RemoteTile key={peer.id} peer={peer} />
            ))}
          </div>
        </div>

        {activeTabPanel && (
          <aside className="w-72 sm:w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col h-full z-20">
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTabPanel === 'chat' && (
                  <>
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-xs text-white">In-Call Messages</h3>
                  </>
                )}
                {activeTabPanel === 'participants' && (
                  <>
                    <Users className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-xs text-white">Participants ({allParticipantsCount})</h3>
                  </>
                )}
              </div>
              <button
                onClick={() => setActiveTabPanel(null)}
                className="p-1 text-zinc-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeTabPanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {chatMessages.length === 0 && (
                    <p className="text-[11px] text-zinc-500 text-center pt-4">
                      No messages yet. Say hello to everyone!
                    </p>
                  )}
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 mb-0.5 text-[10px] text-zinc-400">
                        <span className="font-medium text-zinc-300">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs max-w-[85%] ${msg.isMe
                            ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-semibold'
                            : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-2.5 border-t border-zinc-800 bg-zinc-950">
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5">
                    <input
                      type="text"
                      placeholder="Send message to everyone..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="p-1 bg-emerald-600 dark:bg-emerald-500 disabled:opacity-40 text-white dark:text-black rounded cursor-pointer transition-opacity"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTabPanel === 'participants' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-bold flex items-center justify-center text-xs">
                      {userName ? userName.charAt(0).toUpperCase() : 'Y'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{userName}</span>
                        <span className="text-[10px] text-emerald-400">(You)</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}</span>
                    </div>
                  </div>
                  {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                {remoteList.length === 0 && (
                  <p className="text-[11px] text-zinc-500 px-1 pt-2">
                    Waiting for others. Share the invite link or code: <span className="font-mono">{cleanCode}</span>
                  </p>
                )}

                {remoteList.map((peer) => (
                  <div
                    key={peer.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 animate-fadeIn"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-xs">
                        {(peer.name || 'G').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{peer.name || 'Guest'}</div>
                        <span className="text-[10px] text-zinc-400 capitalize">{peer.connState || 'connected'}</span>
                      </div>
                    </div>
                    {peer.isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      <footer className="h-16 shrink-0 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-center z-20">
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl shadow-lg">

          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-lg font-bold cursor-pointer transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black'
              }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-2.5 rounded-lg font-bold cursor-pointer transition-colors ${isVideoOff ? 'bg-red-500 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            title={isVideoOff ? 'Turn on Camera' : 'Turn off Camera'}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-2.5 rounded-lg font-bold cursor-pointer transition-colors ${isScreenSharing ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <ScreenShare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`p-2.5 rounded-lg font-bold cursor-pointer transition-colors ${isHandRaised ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
          >
            <Hand className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          <button
            onClick={() => setActiveTabPanel(activeTabPanel === 'chat' ? null : 'chat')}
            className={`p-2.5 rounded-lg font-bold cursor-pointer transition-colors ${activeTabPanel === 'chat' ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTabPanel(activeTabPanel === 'participants' ? null : 'participants')}
            className={`p-2.5 rounded-lg font-bold cursor-pointer transition-colors ${activeTabPanel === 'participants' ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            title="Participants"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer hidden sm:block transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}