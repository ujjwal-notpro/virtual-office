import React, { useState, useEffect, useRef } from 'react';
import { Plus, Video, VideoOff, Mic, MicOff, X, Copy, Check, ArrowRight, User } from 'lucide-react';

export default function CreateRoomModal({ isOpen, onClose, onCreate, initialUserName = 'Amit Kumar' }) {
  const [roomTopic, setRoomTopic] = useState('Team Meeting');
  const [meetingCode, setMeetingCode] = useState('');
  const [userName, setUserName] = useState(initialUserName);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (initialUserName) {
      setUserName(initialUserName);
    }
  }, [initialUserName]);

  useEffect(() => {
    if (isOpen) {
      const randomSuffix = Math.random().toString(36).substring(2, 6) + '-' + Math.floor(100 + Math.random() * 900);
      setMeetingCode(`meet-${randomSuffix}`);
      setCopied(false);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

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

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/dashboard?room=${meetingCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      meetingCode: meetingCode || `meet-${Date.now().toString(36)}`,
      roomTopic: roomTopic.trim() || 'New Meeting',
      userName: userName.trim() || 'Host',
      isMicOn,
      isVideoOn,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', color: '#1a1a1a' }}>

        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #e5e5e5' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#174D38', color: '#ffffff' }}>
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>Create Room</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg cursor-pointer"
            style={{ color: '#CBCBCB' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
            {isVideoOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-2" style={{ color: '#CBCBCB' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#174D38', color: '#ffffff' }}>
                  {userName ? userName.charAt(0).toUpperCase() : 'H'}
                </div>
                <span className="text-xs">Camera is off</span>
              </div>
            )}

            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className="p-1.5 rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: isMicOn ? '#174D38' : '#4D1717' }}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="p-1.5 rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: isVideoOn ? '#174D38' : '#4D1717' }}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#1a1a1a' }}>
                Meeting Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Sprint Planning"
                value={roomTopic}
                onChange={(e) => setRoomTopic(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2 rounded-xl text-xs focus:outline-none"
                style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: '#1a1a1a' }}>
                Meeting Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs font-mono focus:outline-none"
                  style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" style={{ color: '#174D38' }} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

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
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
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
              <span>Start Meeting</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
