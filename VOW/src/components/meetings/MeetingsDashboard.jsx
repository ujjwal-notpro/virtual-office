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

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
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
    <div className="h-full flex flex-col bg-white dark:bg-[#0c0c0f] text-zinc-900 dark:text-zinc-100 overflow-y-auto">

      <header className="shrink-0 bg-white dark:bg-[#0c0c0f] border-b border-zinc-200 dark:border-zinc-800 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">

        <div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {getFormattedDate()}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">
            {getGreeting()}, {displayName.split(' ')[0]}
          </h1>
        </div>

        <div className="flex items-center gap-3">

          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-800"
            />
          </div>

          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            <Video className="w-4 h-4" />
            <span>Join Meeting</span>
          </button>

          <div
            onClick={onNavigateToProfile}
            className="flex items-center gap-1.5 p-1 sm:pr-2 bg-emerald-900/15 dark:bg-emerald-950/60 border border-emerald-800/40 dark:border-emerald-700/50 rounded-full cursor-pointer"
            title={displayName}
          >
            <div className="w-7 h-7 rounded-full bg-emerald-800 dark:bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
              {displayInitial}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 hidden sm:block" />
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-white dark:bg-[#121216] border border-emerald-800/30 hover:border-emerald-800/60 dark:border-emerald-700/30 dark:hover:border-emerald-600/60 rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-900/15 dark:bg-emerald-950/60 border border-emerald-800/30 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Join Meeting
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Enter a meeting code or link
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white dark:bg-[#121216] border border-emerald-800/30 hover:border-emerald-800/60 dark:border-emerald-700/30 dark:hover:border-emerald-600/60 rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-900/15 dark:bg-emerald-950/60 border border-emerald-800/30 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Create Room
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
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