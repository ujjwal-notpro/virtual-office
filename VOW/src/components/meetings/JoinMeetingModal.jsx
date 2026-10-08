import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, X, ArrowRight, Hash, User, Layers, Check, Users } from 'lucide-react';

const AVAILABLE_ROOMS = [
  { id: 'room-krishna', name: 'Product Team', lead: 'Krishna (Product Lead)' },
  { id: 'room-yashraj', name: 'Engineering Team', lead: 'Yashraj (Tech Lead)' },
  { id: 'room-devops', name: 'DevOps & Infrastructure', lead: 'Infrastructure Team' },
  { id: 'room-wanda', name: 'Design Studio', lead: 'Wanda (UI/UX Designer)' },
];

// Accepts a plain code ("meet-ab12-345") OR a full invite link (".../dashboard?room=meet-ab12-345")
const extractMeetingCode = (value) => {
  const trimmed = value.trim();
  try {
    const room = new URL(trimmed).searchParams.get('room');
    if (room) return room.trim();
  } catch {
    // not a URL – fall through
  }
  const match = trimmed.match(/[?&]room=([^&\s]+)/);
  if (match) return decodeURIComponent(match[1]);
  return trimmed.replace(/\s+/g, '-');
};

export default function JoinMeetingModal({ isOpen, onClose, onJoin, initialUserName = 'Amit Kumar', initialCode = '' }) {
  const [joinMode, setJoinMode] = useState('all-rooms'); // 'all-rooms' | 'select-rooms' | 'code'
  const [selectedRoomIds, setSelectedRoomIds] = useState(AVAILABLE_ROOMS.map((r) => r.id));
  const [meetingCode, setMeetingCode] = useState('');
  const [userName, setUserName] = useState(initialUserName);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState('');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen && initialCode) {
      setJoinMode('code');
      setMeetingCode(initialCode);
    }
  }, [isOpen, initialCode]);

  useEffect(() => {
    if (initialUserName) {
      setUserName(initialUserName);
    }
  }, [initialUserName]);

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    setError('');
    let active = true;

    async function setupPreview() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isMicOn,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera/Mic preview error:', err);
      }
    }

    setupPreview();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, isVideoOn, isMicOn]);

  if (!isOpen) return null;

  const toggleRoomSelect = (id) => {
    setSelectedRoomIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSelectAllRooms = () => {
    if (selectedRoomIds.length === AVAILABLE_ROOMS.length) {
      setSelectedRoomIds([]);
    } else {
      setSelectedRoomIds(AVAILABLE_ROOMS.map((r) => r.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (joinMode === 'code') {
      const cleanCode = extractMeetingCode(meetingCode);
      if (!cleanCode) {
        setError('Please enter a valid meeting code or link');
        return;
      }
      onJoin({
        meetingCode: cleanCode,
        roomTopic: `Meeting (${cleanCode})`,
        userName: userName.trim() || 'Guest',
        isMicOn,
        isVideoOn,
        connectedRooms: [],
      });
    } else {
      if (selectedRoomIds.length === 0) {
        setError('Please select at least 1 room to connect');
        return;
      }
      const chosenRooms = AVAILABLE_ROOMS.filter((r) => selectedRoomIds.includes(r.id));
      const topic =
        selectedRoomIds.length === AVAILABLE_ROOMS.length
          ? 'All-Rooms Company Conference'
          : `Multi-Room Sync (${chosenRooms.map((r) => r.name).join(' + ')})`;

      onJoin({
        meetingCode: 'all-rooms-sync',
        roomTopic: topic,
        userName: userName.trim() || 'Host',
        isMicOn,
        isVideoOn,
        connectedRooms: chosenRooms,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden text-zinc-900 dark:text-zinc-100 flex flex-col max-h-[90vh]">        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Join Meeting</h3>
              <p className="text-[11px] text-zinc-500">Connect individual or all rooms together</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Camera preview */}
          <div className="relative aspect-video max-h-44 bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center mx-auto w-full">
            {isVideoOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-zinc-400">
                <div className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black flex items-center justify-center font-bold text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs">Camera is off</span>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-1.5 rounded-lg text-white cursor-pointer ${isMicOn ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-red-500'}`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-1.5 rounded-lg text-white cursor-pointer ${isVideoOn ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-red-500'}`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Join Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setJoinMode('all-rooms')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${joinMode === 'all-rooms'
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Connect All Rooms</span>
            </button>
            <button
              type="button"
              onClick={() => setJoinMode('code')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${joinMode === 'code'
                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
                }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Room Code</span>
            </button>
          </div>

          {/* All Rooms / Select Rooms Mode */}
          {joinMode === 'all-rooms' ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Rooms to Merge on Call ({selectedRoomIds.length}/{AVAILABLE_ROOMS.length})
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllRooms}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {selectedRoomIds.length === AVAILABLE_ROOMS.length ? 'Deselect All' : 'Select All Rooms'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_ROOMS.map((room) => {
                  const isSelected = selectedRoomIds.includes(room.id);
                  return (
                    <div
                      key={room.id}
                      onClick={() => toggleRoomSelect(room.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                        }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {(room.name || 'R').charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                            {room.name}
                          </h4>
                          <p className="text-[10px] text-zinc-500 truncate">{room.lead}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${isSelected
                          ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white dark:text-black'
                          : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                          }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Meeting Code or Link
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="e.g. meet-842"
                  value={meetingCode}
                  onChange={(e) => {
                    setMeetingCode(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* User Display Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>
                {joinMode === 'all-rooms'
                  ? selectedRoomIds.length === AVAILABLE_ROOMS.length
                    ? 'Connect All Rooms Now'
                    : `Join ${selectedRoomIds.length} Rooms Call`
                  : 'Join Room'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}