import React, { useState } from 'react';
import {
  Video,
  Plus,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';
import JoinMeetingModal from './JoinMeetingModal';
import CreateRoomModal from './CreateRoomModal';
import MeetingRoom from './MeetingRoom';

export default function MeetingsDashboard({ userProfile = { name: 'Amit Kumar' }, onNavigateToProfile }) {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(1);

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

  const displayName = userProfile?.name || 'Amit Kumar';
  const displayInitial = displayName.charAt(0).toUpperCase() || 'A';

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
      {/* Top Header Bar */}
      <header className="shrink-0 bg-white dark:bg-[#0c0c0f] border-b border-zinc-200 dark:border-zinc-800 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
        {/* Left: Date & Greeting */}
        <div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {getFormattedDate()}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">
            {getGreeting()}, {displayName.split(' ')[0]} 👋
          </h1>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[180px] sm:min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setNotificationCount(0)}
            className="relative p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Join Meeting button */}
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Join Meeting</span>
          </button>

          {/* User Profile Pill */}
          <div
            onClick={onNavigateToProfile}
            className="flex items-center gap-1.5 p-1 sm:pr-2 bg-amber-100 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/40 rounded-full cursor-pointer"
            title={displayName}
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
              {displayInitial}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 hidden sm:block" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
            Quick Actions
          </h2>

          {/* Circled Cards: Join Meeting & Create Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Join Meeting */}
            <div
              onClick={() => setIsJoinModalOpen(true)}
              className="bg-white dark:bg-[#121216] border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[140px]"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
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

            {/* Card 2: Create Room */}
            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white dark:bg-[#121216] border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 cursor-pointer flex flex-col justify-between min-h-[140px]"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
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

      {/* Join Meeting Modal */}
      <JoinMeetingModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleStartJoinedMeeting}
        initialUserName={displayName}
      />

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleStartCreatedMeeting}
        initialUserName={displayName}
      />
    </div>
  );
}
