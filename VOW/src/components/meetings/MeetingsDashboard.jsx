import React, { useState } from 'react';
import {
  Video,
  Plus,
  Search,
  ChevronDown,
} from 'lucide-react';
import JoinMeetingModal from './JoinMeetingModal';
import CreateRoomModal from './CreateRoomModal';
import MeetingRoom from './MeetingRoom';

export default function MeetingsDashboard({ userProfile = { name: 'Virtual Office' }, onNavigateToProfile }) {
  const inviteCode = new URLSearchParams(window.location.search).get('room') || '';
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(!!inviteCode);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };


  const displayName = userProfile?.name || 'Virtual Office';
  const displayInitial = displayName.charAt(0).toUpperCase() || 'V';

  const handleStartCreatedMeeting = (config) => {
    setIsCreateModalOpen(false);
    setActiveMeeting(config);
  };

  const handleStartJoinedMeeting = (config) => {
    setIsJoinModalOpen(false);
    setActiveMeeting(config);
  };

  const handleLeaveMeeting = () => {
    setActiveMeeting(null);
  };

  if (activeMeeting) {
    return (
      <MeetingRoom
        meetingConfig={activeMeeting}
        onLeave={handleLeaveMeeting}
        currentUser={userProfile}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }}>

      <header className="shrink-0 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5' }}>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>
            {getGreeting()}, {displayName.split(' ')[0]}
          </h1>
        </div>

        <div className="flex items-center gap-3">

          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#CBCBCB' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none"
              style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
            />
          </div>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            style={{ backgroundColor: '#174D38', color: '#ffffff' }}
          >
            <Video className="w-4 h-4" />
            <span>Join Meeting</span>
          </button>

          <div
            onClick={onNavigateToProfile}
            className="flex items-center gap-1.5 p-1 sm:pr-2 rounded-full cursor-pointer"
            style={{ backgroundColor: 'rgba(23,77,56,0.1)', border: '1px solid rgba(23,77,56,0.3)' }}
            title={displayName}
          >
            <div className="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-xs" style={{ backgroundColor: '#174D38' }}>
              {displayInitial}
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: '#CBCBCB' }} />
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div
              onClick={() => setIsJoinModalOpen(true)}
              className="rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md"
              style={{ backgroundColor: '#ffffff', border: '1px solid rgba(23,77,56,0.2)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(23,77,56,0.1)', border: '1px solid rgba(23,77,56,0.2)', color: '#174D38' }}>
                <Video className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
                  Join Meeting
                </h3>
                <p className="text-xs mt-1" style={{ color: '#CBCBCB' }}>
                  Enter a meeting code or link
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md"
              style={{ backgroundColor: '#ffffff', border: '1px solid rgba(23,77,56,0.2)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(23,77,56,0.1)', border: '1px solid rgba(23,77,56,0.2)', color: '#174D38' }}>
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
                  Create Room
                </h3>
                <p className="text-xs mt-1" style={{ color: '#CBCBCB' }}>
                  Set up a new room
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleStartJoinedMeeting}
        initialUserName={displayName}
        initialCode={inviteCode}
      />

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleStartCreatedMeeting}
        initialUserName={displayName}
      />
    </div>
  );
}