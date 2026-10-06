import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
} from 'lucide-react';
import { getSocket, joinRoom, leaveRoom } from '../../services/socket';

const ALL_AVAILABLE_ROOM_PEOPLE = [
  {
    id: 'room-krishna',
    name: 'Krishna',
    role: 'Product Lead',
    roomName: 'Product Team',
    avatar: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=600&auto=format&fit=crop&q=60',
    avatarBg: 'bg-emerald-600',
    initials: 'K',
    isMuted: false,
    isVideoOn: false,
    isSpeaking: true,
  },
  {
    id: 'room-yashraj',
    name: 'Yashraj',
    role: 'Tech Lead',
    roomName: 'Engineering Team',
    avatar: 'https://images.unsplash.com/photo-1740252117012-bb53ad05e370?w=600&auto=format&fit=crop&q=60',
    avatarBg: 'bg-amber-600',
    initials: 'Y',
    isMuted: true,
    isVideoOn: false,
    isSpeaking: false,
  },
  {
    id: 'room-devops',
    name: 'DevOps & Infra',
    role: 'Infrastructure Team',
    roomName: 'DevOps Channel',
    avatar: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=600&auto=format&fit=crop&q=60',
    avatarBg: 'bg-blue-600',
    initials: 'D',
    isMuted: false,
    isVideoOn: false,
    isSpeaking: false,
  },
  {
    id: 'room-wanda',
    name: 'Wanda',
    role: 'UI/UX Designer',
    roomName: 'Design Studio',
    avatar: 'https://plus.unsplash.com/premium_photo-1689564003745-946f35267ffe?w=600&auto=format&fit=crop&q=60',
    avatarBg: 'bg-rose-500',
    initials: 'W',
    isMuted: false,
    isVideoOn: false,
    isSpeaking: false,
  },
];

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
    connectedRooms = [],
  } = meetingConfig;

  const [isMuted, setIsMuted] = useState(!initialMic);
  const [isVideoOff, setIsVideoOff] = useState(!initialVideo);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeTabPanel, setActiveTabPanel] = useState(null); // 'chat' | 'participants' | 'rooms' | null
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState('room-krishna');

  const initialParticipants = connectedRooms.length > 0
    ? ALL_AVAILABLE_ROOM_PEOPLE.filter((p) => connectedRooms.some((r) => r.id === p.id))
    : ALL_AVAILABLE_ROOM_PEOPLE;

  const [participants, setParticipants] = useState(initialParticipants);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Krishna',
      text: `Connected all teams to "${roomTopic}"! Everyone is here.`,
      time: '12:00 PM',
      isMe: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const roomContainerRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const socket = getSocket();
    const roomId = `meeting-${meetingCode}`;
    joinRoom(roomId);

    if (socket) {
      socket.emit('meeting-join', {
        roomId,
        user: { name: userName, isMuted, isVideoOff },
      });

      const handleMeetingMessage = (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      };
      socket.on('meeting-message', handleMeetingMessage);

      return () => {
        socket.off('meeting-message', handleMeetingMessage);
        leaveRoom(roomId);
      };
    }
  }, [meetingCode, userName]);

  useEffect(() => {
    let active = true;

    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isMuted;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = !isVideoOff;
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Unable to access camera or microphone:', err);
      }
    }

    startMedia();

    return () => {
      active = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOff;
      });
    }
  }, [isVideoOff]);

  useEffect(() => {
    const interval = setInterval(() => {
      const candidates = ['room-krishna', 'room-yashraj', 'local-user'];
      const randomIdx = Math.floor(Math.random() * candidates.length);
      setActiveSpeakerId(candidates[randomIdx]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTabPanel === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTabPanel]);

  const toggleMic = () => setIsMuted((prev) => !prev);
  const toggleVideo = () => setIsVideoOff((prev) => !prev);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.warn('Screen share canceled or failed:', err);
      }
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
      id: Date.now(),
      sender: userName || 'You',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('meeting-message', {
        roomId: `meeting-${meetingCode}`,
        message: newMsg,
      });
    }
  };

  const handleToggleMergeRoom = (roomPerson) => {
    if (participants.some((p) => p.id === roomPerson.id)) {
      setParticipants((prev) => prev.filter((p) => p.id !== roomPerson.id));
    } else {
      setParticipants((prev) => [...prev, roomPerson]);
    }
  };

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/dashboard?room=${meetingCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const allParticipantsCount = participants.length + 1;

  return (
    <div
      ref={roomContainerRef}
      className="relative w-full h-full flex flex-col bg-zinc-950 text-white select-none overflow-hidden"
    >
      {/* Top Navbar */}
      <header className="h-14 shrink-0 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">{roomTopic}</h2>
              <span className="text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                {allParticipantsCount} Rooms/Members
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{meetingCode}</span>
              <span>•</span>
              <span>{formatDuration(meetingDuration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Merge / Add Room button */}
          <button
            onClick={() => setActiveTabPanel(activeTabPanel === 'rooms' ? null : 'rooms')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold cursor-pointer"
            title="Merge more rooms into call"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rooms ({participants.length}/{ALL_AVAILABLE_ROOM_PEOPLE.length})</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={copyMeetingLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
            title="Copy Invite Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Invite Link</span>
              </>
            )}
          </button>

          {/* Leave */}
          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-center items-center">
          {/* Screen Share */}
          {isScreenSharing && (
            <div className="w-full max-w-4xl aspect-video mb-3 rounded-xl overflow-hidden bg-black border border-zinc-700 relative">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-zinc-900/90 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1.5">
                <ScreenShare className="w-3.5 h-3.5 text-amber-500" />
                <span>Presenting screen</span>
              </div>
            </div>
          )}

          {/* Responsive Multi-Room Grid */}
          <div
            className={`w-full max-w-5xl grid gap-3 h-full max-h-[75vh] ${
              allParticipantsCount <= 2
                ? 'grid-cols-1 md:grid-cols-2'
                : allParticipantsCount <= 4
                ? 'grid-cols-2'
                : 'grid-cols-2 md:grid-cols-3'
            }`}
          >
            {/* Local Host Tile */}
            <div
              className={`relative rounded-xl overflow-hidden bg-zinc-900 border transition-all flex items-center justify-center ${
                activeSpeakerId === 'local-user' && !isMuted
                  ? 'border-amber-500'
                  : 'border-zinc-800'
              }`}
            >
              {!isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-zinc-950 font-bold text-xl flex items-center justify-center">
                    {userName ? userName.charAt(0).toUpperCase() : 'Y'}
                  </div>
                  <span className="text-xs text-zinc-300 font-medium">{userName} (You)</span>
                </div>
              )}

              {/* Name Tag & Room Badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <div className="bg-black/70 px-2.5 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                  <span>{userName} (You)</span>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/20 px-1 rounded">Host</span>
                </div>

                <div className="flex items-center gap-1">
                  {isHandRaised && (
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center">
                      <Hand className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                      isMuted ? 'bg-red-500' : 'bg-emerald-600'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Rooms Participants */}
            {participants.map((person) => {
              const isSpeaker = activeSpeakerId === person.id && !person.isMuted;
              return (
                <div
                  key={person.id}
                  className={`relative rounded-xl overflow-hidden bg-zinc-900 border transition-all flex items-center justify-center ${
                    isSpeaker ? 'border-amber-500' : 'border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-16 h-16 rounded-full ${person.avatarBg} text-white font-bold text-xl flex items-center justify-center overflow-hidden border border-zinc-700`}
                    >
                      {person.avatar ? (
                        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        person.initials
                      )}
                    </div>
                    <div className="text-center">
                      <h4 className="text-xs font-bold text-white">{person.name}</h4>
                      <p className="text-[10px] text-zinc-400">{person.role}</p>
                    </div>
                  </div>

                  {/* Name Tag, Room Badge & Status */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <div className="bg-black/70 px-2.5 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                      <span>{person.name}</span>
                      <span className="text-[10px] text-zinc-400 border border-zinc-700 px-1 rounded">
                        {person.roomName}
                      </span>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${
                        person.isMuted ? 'bg-red-500' : 'bg-emerald-600'
                      }`}
                    >
                      {person.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panels */}
        {activeTabPanel && (
          <aside className="w-72 sm:w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col h-full z-20">
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTabPanel === 'chat' && (
                  <>
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-xs text-white">In-Call Messages</h3>
                  </>
                )}
                {activeTabPanel === 'participants' && (
                  <>
                    <Users className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-xs text-white">Participants ({allParticipantsCount})</h3>
                  </>
                )}
                {activeTabPanel === 'rooms' && (
                  <>
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-xs text-white">Merged Rooms ({participants.length})</h3>
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

            {/* Merge Rooms Management Panel */}
            {activeTabPanel === 'rooms' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <p className="text-[11px] text-zinc-400 px-1">
                  Connect or disconnect rooms on this call:
                </p>
                {ALL_AVAILABLE_ROOM_PEOPLE.map((roomPerson) => {
                  const isMerged = participants.some((p) => p.id === roomPerson.id);
                  return (
                    <div
                      key={roomPerson.id}
                      onClick={() => handleToggleMergeRoom(roomPerson)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        isMerged
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-zinc-800/60 border-zinc-700/60 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={roomPerson.avatar}
                          alt={roomPerson.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{roomPerson.roomName}</div>
                          <span className="text-[10px] text-zinc-400">{roomPerson.lead || roomPerson.name}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isMerged
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {isMerged ? 'Connected' : '+ Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Chat Panel */}
            {activeTabPanel === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
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
                        className={`px-3 py-1.5 rounded-xl text-xs max-w-[85%] ${
                          msg.isMe
                            ? 'bg-amber-500 text-zinc-950 font-medium'
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
                      placeholder="Send message to all rooms..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="p-1 bg-amber-500 disabled:opacity-40 text-zinc-950 rounded cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Participants Panel */}
            {activeTabPanel === 'participants' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-zinc-950 font-bold flex items-center justify-center text-xs">
                      {userName ? userName.charAt(0).toUpperCase() : 'Y'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{userName}</span>
                        <span className="text-[10px] text-amber-400">(Host)</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Current Room</span>
                    </div>
                  </div>
                  {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                </div>

                {participants.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{person.name}</div>
                        <span className="text-[10px] text-zinc-400">{person.roomName}</span>
                      </div>
                    </div>
                    {person.isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Control Bar */}
      <footer className="h-16 shrink-0 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-center z-20">
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              isMuted ? 'bg-red-500 text-white' : 'bg-amber-500 text-zinc-950'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Video */}
          <button
            onClick={toggleVideo}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
            title={isVideoOff ? 'Turn on Camera' : 'Turn off Camera'}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              isScreenSharing ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <ScreenShare className="w-4 h-4" />
          </button>

          {/* Hand Raise */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              isHandRaised ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
            title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
          >
            <Hand className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-zinc-800 mx-1" />

          {/* Rooms Multi-Connect Toggle */}
          <button
            onClick={() => setActiveTabPanel(activeTabPanel === 'rooms' ? null : 'rooms')}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              activeTabPanel === 'rooms' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
            title="Manage Connected Rooms"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setActiveTabPanel(activeTabPanel === 'chat' ? null : 'chat')}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              activeTabPanel === 'chat' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
            title="Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Participants */}
          <button
            onClick={() => setActiveTabPanel(activeTabPanel === 'participants' ? null : 'participants')}
            className={`p-2.5 rounded-lg font-bold cursor-pointer ${
              activeTabPanel === 'participants' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
            title="Participants"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer hidden sm:block"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
