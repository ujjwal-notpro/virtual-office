import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, User, Settings, LogOut,
  Video, X, Menu, ChevronRight,
  PanelLeftClose, BotMessageSquare
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../../services/api';
import { connectSocket, getSocket, joinRoom, leaveRoom } from '../../services/socket';
import CallModal from '../../components/chat/CallModal';
import IncomingCallModal from '../../components/chat/IncomingCallModal';
import brandLogo from '../../assets/image.png';
import { INITIAL_CONVERSATIONS } from './data/conversations';
import { getAvatarInitial, getAvatarBgColor } from './utils/avatarHelpers';

import ChatSection from './sections/ChatSection';
import MeetingsSection from './sections/MeetingsSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import AISummary from './sections/aisummary';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('meetings');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState(1);
  const outgoingMessageIdsRef = useRef(new Set());
  const activeChatIdRef = useRef(activeChatId);
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  const storedUser = getStoredUser();
  const [profile, setProfile] = useState({
    name: storedUser?.name || 'Workspace Member',
    role: storedUser?.role ? String(storedUser.role).toUpperCase() : 'EMPLOYEE',
    email: storedUser?.email || 'user@flowbit.io',
    phone: storedUser?.phone || '',
    department: 'Engineering & Product',
    location: 'Remote',
    timezone: 'PST (UTC -8)',
    bio: 'Flow Bit Virtual Workspace member.',
    status: 'Online'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callType, setCallType] = useState('video');
  const [incomingCall, setIncomingCall] = useState(null);

  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('room');
    const tabParam = params.get('tab');
    if (roomParam || tabParam === 'meetings' || location.pathname === '/meetings' || location.pathname === '/meeting') {
      setActiveTab('meetings');
    } else if (tabParam === 'chat' || location.pathname === '/chat') {
      setActiveTab('chat');
    } else if (tabParam === 'profile' || location.pathname === '/profile') {
      setActiveTab('profile');
    } else if (tabParam === 'settings' || location.pathname === '/settings') {
      setActiveTab('settings');
    } else if (tabParam === 'chatbot' || tabParam === 'aisummary' || location.pathname === '/chatbot' || location.pathname === '/aisummary') {
      setActiveTab('chatbot');
    } else {
      setActiveTab('meetings');
    }
  }, [location]);

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' };
    const formatted = now.toLocaleDateString('en-US', options).replace(',', ' |');
    setCurrentDateFormatted(formatted);

    const user = getStoredUser();
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        role: user.role ? user.role.toUpperCase() : prev.role,
      }));
    }

    const socket = connectSocket();
    let presenceBc = null;
    try {
      presenceBc = new BroadcastChannel('vow_presence_channel');
      presenceBc.onmessage = (event) => {
        const { type, data } = event.data || {};
        if (type === 'incoming-call' && data?.callerName !== profile.name) {
          setIncomingCall(data);
        } else if (type === 'call-rejected') {
          setIncomingCall(null);
        }
      };
    } catch (e) {
      console.warn('Presence BC error:', e);
    }

    if (socket) {
      const handleIncoming = (data) => setIncomingCall(data);
      const handleRejected = () => setIncomingCall(null);
      const handleReceiveMessage = (data) => {
        const isOwnEcho = data.clientMessageId && outgoingMessageIdsRef.current.has(data.clientMessageId);
        if (isOwnEcho) return;
        const incomingMsg = {
          id: data.id ?? data.messageId ?? Date.now() + Math.random(),
          sender: 'them',
          text: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const roomConversationId = Number(String(data.roomId || '').replace(/^room-/, ''));
        const currentActiveChatId = activeChatIdRef.current;
        const conversationId = Number.isFinite(roomConversationId) && roomConversationId > 0
          ? roomConversationId : currentActiveChatId;
        setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, incomingMsg],
              time: 'Just now',
              unread: c.id === currentActiveChatId ? c.unread : c.unread + 1,
            };
          }
          return c;
        }));
      };

      socket.on('incoming-call', handleIncoming);
      socket.on('call-rejected', handleRejected);
      socket.on('receive-message', handleReceiveMessage);
      joinRoom(`room-${activeChatId}`);

      return () => {
        if (presenceBc) presenceBc.close();
        socket.off('incoming-call', handleIncoming);
        socket.off('call-rejected', handleRejected);
        socket.off('receive-message', handleReceiveMessage);
        leaveRoom(`room-${activeChatId}`);
      };
    }
    return () => { if (presenceBc) presenceBc.close(); };
  }, [activeChatId, profile.name]);

  const handleStartCall = (type) => {
    setCallType(type);
    setIsCallOpen(true);
    const callData = { roomId: `room-${activeChat.id}`, callerName: profile.name, callerAvatar: '', callType: type };
    try {
      const bc = new BroadcastChannel('vow_presence_channel');
      bc.postMessage({ type: 'incoming-call', data: callData });
      bc.close();
    } catch (e) { console.warn(e); }
    const socket = getSocket();
    if (socket?.connected) socket.emit('call-user', callData);
  };

  const handleAcceptIncomingCall = () => {
    if (incomingCall) {
      setCallType(incomingCall.callType || 'video');
      setIsCallOpen(true);
      setIncomingCall(null);
    }
  };

  const handleDeclineIncomingCall = () => {
    if (incomingCall) {
      try {
        const bc = new BroadcastChannel('vow_presence_channel');
        bc.postMessage({ type: 'call-rejected', data: { roomId: incomingCall.roomId } });
        bc.close();
      } catch (e) { console.warn(e); }
      const socket = getSocket();
      if (socket?.connected) socket.emit('reject-call', { roomId: incomingCall.roomId });
      setIncomingCall(null);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleLogout = () => navigate('/sign-in');

  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0);

  const NAV_ITEMS = [
    { id: 'chat', label: 'Chat', Icon: MessageSquare, badge: totalUnread },
    { id: 'meetings', label: 'Meetings', Icon: Video },
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'settings', label: 'Settings', Icon: Settings },
    { id: 'chatbot', label: 'Chatbot', Icon: BotMessageSquare },
  ];

  const navBtnClass = (id) => `w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === id
    ? id === 'meetings'
      ? 'bg-[#174D38]/10 text-[#174D38] shadow-xs border border-[#174D38]/20 font-semibold'
      : 'bg-[#F2F2F2] text-[#1a1a1a] shadow-xs border border-[#CBCBCB] font-semibold'
    : id === 'meetings'
      ? 'text-[#CBCBCB] hover:text-[#174D38] hover:bg-[#174D38]/5'
      : 'text-[#CBCBCB] hover:text-[#1a1a1a] hover:bg-[#F2F2F2]'
    }`;

  const iconClass = (id) => `w-4 h-4 shrink-0 ${activeTab === id ? 'text-[#174D38]' : 'text-[#CBCBCB]'}`;

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans select-none antialiased transition-colors duration-300" style={{ backgroundColor: '#F2F2F2', color: '#1a1a1a' }}>

      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
        />
      )}

      <aside className={`hidden md:flex relative inset-y-0 left-0 z-30 shrink-0 flex-col justify-between py-5 transition-all duration-300 shadow-sm ${isSidebarCollapsed ? 'w-16 px-2' : 'w-56 px-3'}`} style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e5e5e5' }}>
        <div>

          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} mb-8`}>
            {isSidebarCollapsed ? (
              <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
                <div>
                  <h1 className="text-base font-bold tracking-tight leading-none" style={{ color: '#174D38' }}>Flow Bit</h1>
                  <span className="text-[11px] font-medium" style={{ color: '#CBCBCB' }}>Virtual Office</span>
                </div>
              </div>
            )}
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={navBtnClass(id)} title={isSidebarCollapsed ? label : undefined}>
                <Icon className={iconClass(id)} />
                {!isSidebarCollapsed && <span>{label}</span>}
                {!isSidebarCollapsed && badge > 0 && (
                  <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(23,77,56,0.15)', color: '#174D38', border: '1px solid rgba(23,77,56,0.3)' }}>{badge}</span>
                )}
                {isSidebarCollapsed && badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#174D38' }} />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 px-1 space-y-1.5" style={{ borderTop: '1px solid #e5e5e5' }}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer`}
            style={{ color: '#CBCBCB' }}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <PanelLeftClose className="w-4 h-4 shrink-0" />}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer`}
            style={{ color: '#4D1717' }}
            title={isSidebarCollapsed ? 'Log Out' : undefined}
          >
            <LogOut className="w-4 h-4 rotate-180 shrink-0" style={{ color: '#4D1717' }} />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      <aside className={`fixed md:hidden inset-y-0 left-0 z-50 w-64 flex flex-col justify-between py-5 px-3 transition-transform duration-300 shadow-2xl ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e5e5e5' }}>
        <div>
          <div className="flex items-center justify-between px-3 mb-8">
            <div className="flex items-center gap-3">
              <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
              <div>
                <h1 className="text-base font-bold tracking-tight leading-none" style={{ color: '#174D38' }}>Flow Bit</h1>
                <span className="text-[11px] font-medium" style={{ color: '#CBCBCB' }}>Virtual Office</span>
              </div>
            </div>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: '#CBCBCB' }} title="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === id
                  ? id === 'meetings'
                    ? 'bg-[#174D38]/10 text-[#174D38] shadow-xs border border-[#174D38]/30 font-semibold'
                    : 'bg-[#F2F2F2] text-[#1a1a1a] shadow-xs border border-[#CBCBCB] font-semibold'
                  : 'text-[#CBCBCB] hover:text-[#1a1a1a] hover:bg-[#F2F2F2] border border-transparent'
                  }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === id ? 'text-[#174D38]' : 'text-[#CBCBCB]'}`} />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(23,77,56,0.15)', color: '#174D38', border: '1px solid rgba(23,77,56,0.3)' }}>{badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="pt-4 px-1" style={{ borderTop: '1px solid #e5e5e5' }}>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer" style={{ color: '#4D1717' }}>
            <LogOut className="w-4 h-4 rotate-180" style={{ color: '#4D1717' }} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden pb-14 md:pb-0 transition-colors duration-300" style={{ backgroundColor: '#F2F2F2' }}>

        <header className="h-16 shrink-0 px-3.5 md:px-6 flex items-center justify-between z-10 transition-colors duration-300" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5' }}>
          <div className="flex items-center gap-2.5 md:gap-3.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-1 hover:bg-[#F2F2F2] rounded-xl md:hidden cursor-pointer"
              style={{ color: '#CBCBCB' }}
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${getAvatarBgColor(profile.name)} text-white font-bold flex items-center justify-center text-xs md:text-sm shadow-md ring-2 transition-all shrink-0`}>
              {getAvatarInitial(profile.name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium" style={{ color: '#666' }}>
                <span>Hello!</span>
                <span className="font-bold truncate max-w-[120px] sm:max-w-[200px]" style={{ color: '#1a1a1a' }}>{profile.name}</span>
              </div>
              <span className="text-[11px] md:text-xs font-medium" style={{ color: '#CBCBCB' }}>User</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span className="text-xs font-semibold tracking-wide" style={{ color: '#666' }}>
              {currentDateFormatted || 'Saturday | Oct 03, 2026'}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'chat' && (
            <ChatSection
              conversations={conversations}
              setConversations={setConversations}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              profile={profile}
              outgoingMessageIdsRef={outgoingMessageIdsRef}
              onStartCall={handleStartCall}
            />
          )}

          {activeTab === 'meetings' && (
            <MeetingsSection
              userProfile={profile}
              onNavigateToProfile={() => setActiveTab('profile')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileSection
              profile={profile}
              setProfile={setProfile}
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              profileSavedToast={profileSavedToast}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsSection />
          )}

          {activeTab === 'chatbot' && (
            <div className="h-full w-full overflow-y-auto">
              <AISummary />
            </div>
          )}
        </main>
      </div>

      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 h-14 backdrop-blur-md flex items-center justify-around px-2" style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderTop: '1px solid #e5e5e5' }}>
        {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            style={{ color: activeTab === id ? '#174D38' : '#CBCBCB' }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{label}</span>
            {badge > 0 && <span className="absolute top-1 right-1/4 w-2 h-2 rounded-full" style={{ backgroundColor: '#174D38' }} />}
          </button>
        ))}
      </nav>

      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        callType={callType}
        recipient={activeChat}
        currentUser={profile}
      />
      <IncomingCallModal
        isOpen={!!incomingCall}
        incomingCall={incomingCall}
        onAccept={handleAcceptIncomingCall}
        onDecline={handleDeclineIncomingCall}
      />
    </div>
  );
}
