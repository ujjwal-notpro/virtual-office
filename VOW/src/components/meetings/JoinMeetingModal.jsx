import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, X, ArrowRight, Hash, User, Layers, Check, Users } from 'lucide-react';

const AVAILABLE_ROOMS = [
  { id: 'room-krishna', name: 'Product Team', lead: 'Krishna (Product Lead)' },
  { id: 'room-yashraj', name: 'Engineering Team', lead: 'Yashraj (Tech Lead)' },
  { id: 'room-devops', name: 'DevOps & Infrastructure', lead: 'Infrastructure Team' },
  { id: 'room-wanda', name: 'Design Studio', lead: 'Wanda (UI/UX Designer)' },
];

const extractMeetingCode = (value) => {
  const trimmed = value.trim();
  try {
    const room = new URL(trimmed).searchParams.get('room');
    if (room) return room.trim();
  } catch {

  }
  const match = trimmed.match(/[?&]room=([^&\s]+)/);
  if (match) return decodeURIComponent(match[1]);
  return trimmed.replace(/\s+/g, '-');
};

export default function JoinMeetingModal({ isOpen, onClose, onJoin, initialUserName = 'Amit Kumar', initialCode = '' }) {
  const [joinMode, setJoinMode] = useState('all-rooms');
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
      <div className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', color: '#1a1a1a' }}>
        <div className="px-5 py-3.5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #e5e5e5' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#174D38', color: '#ffffff' }}>
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>Join Meeting</h3>
              <p className="text-[11px]" style={{ color: '#CBCBCB' }}>Connect individual or all rooms together</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg cursor-pointer"
            style={{ color: '#CBCBCB' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">

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
              <div className="flex flex-col items-center gap-1.5" style={{ color: '#CBCBCB' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#174D38', color: '#ffffff' }}>
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs">Camera is off</span>
              </div>
            )}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className="p-1.5 rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: isMicOn ? '#174D38' : '#4D1717' }}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="p-1.5 rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: isVideoOn ? '#174D38' : '#4D1717' }}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ backgroundColor: '#F2F2F2' }}>
            <button
              type="button"
              onClick={() => setJoinMode('all-rooms')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              style={joinMode === 'all-rooms'
                ? { backgroundColor: '#ffffff', color: '#174D38', border: '1px solid #e5e5e5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                : { color: '#CBCBCB', border: '1px solid transparent' }
              }
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Connect All Rooms</span>
            </button>
            <button
              type="button"
              onClick={() => setJoinMode('code')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              style={joinMode === 'code'
                ? { backgroundColor: '#ffffff', color: '#174D38', border: '1px solid #e5e5e5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                : { color: '#CBCBCB', border: '1px solid transparent' }
              }
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Room Code</span>
            </button>
          </div>

          {joinMode === 'all-rooms' ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>
                  Select Rooms to Merge on Call ({selectedRoomIds.length}/{AVAILABLE_ROOMS.length})
                </span>
                <button
                  type="button"
                  onClick={handleSelectAllRooms}
                  className="text-xs font-semibold hover:underline cursor-pointer"
                  style={{ color: '#174D38' }}
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
                      className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isSelected ? 'rgba(23,77,56,0.06)' : '#F2F2F2',
                        border: `1px solid ${isSelected ? 'rgba(23,77,56,0.3)' : '#e5e5e5'}`,
                      }}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs" style={{ backgroundColor: '#174D38', color: '#ffffff' }}>
                          {(room.name || 'R').charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold truncate" style={{ color: '#1a1a1a' }}>
                            {room.name}
                          </h4>
                          <p className="text-[10px] truncate" style={{ color: '#CBCBCB' }}>{room.lead}</p>
                        </div>
                      </div>
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isSelected ? '#174D38' : '#ffffff',
                          border: `1px solid ${isSelected ? '#174D38' : '#CBCBCB'}`,
                          color: '#ffffff',
                        }}
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
              <label className="block text-xs font-semibold mb-1" style={{ color: '#1a1a1a' }}>
                Meeting Code or Link
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#CBCBCB' }} />
                <input
                  type="text"
                  placeholder="e.g. meet-842"
                  value={meetingCode}
                  onChange={(e) => {
                    setMeetingCode(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none"
                  style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: '#1a1a1a' }}>
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#CBCBCB' }} />
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none"
                style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
              />
            </div>
          </div>

          {error && <p className="text-xs font-medium" style={{ color: '#4D1717' }}>{error}</p>}

          <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer"
              style={{ color: '#CBCBCB' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
              style={{ backgroundColor: '#174D38', color: '#ffffff' }}
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