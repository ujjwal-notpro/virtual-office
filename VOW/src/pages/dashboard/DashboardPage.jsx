import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Shield,
  Camera,
  Edit3,
  Save,
  FileText,
  Download,
  Image as ImageIcon,
  File,
  X,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Menu,
  ArrowLeft,
  PanelLeftClose,
  PanelLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';
import { getStoredUser } from '../../services/api';
import { connectSocket, getSocket, joinRoom, leaveRoom } from '../../services/socket';
import CallModal from '../../components/chat/CallModal';
import IncomingCallModal from '../../components/chat/IncomingCallModal';
import brandLogo from '../../assets/image.png';
import { INITIAL_CONVERSATIONS } from './data/conversations';
import ChatSection from './sections/ChatSection';
import MeetingsSection from './sections/MeetingsSection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import MeetingsDashboard from '../../components/meetings/MeetingsDashboard';

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊',
      '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😋', '😛', '😜', '🤪', '😝',
      '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒',
      '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢',
      '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
      '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰',
      '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤',
      '😡', '😠', '🤬'
    ]
  },
  {
    name: 'Gestures',
    emojis: [
      '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '👂', '👃', '🧠', '👀', '👁️', '👅', '👄',
      '👈', '👉', '👆', '👇', '☝️', '✌️', '🤞', '🤟', '🤘', '🤙', '🖐️', '✋',
      '🖖', '👋'
    ]
  },
  {
    name: 'Work & Objects',
    emojis: [
      '💼', '📁', '📂', '📄', '📑', '📊', '📈', '📉', '📌', '📍', '📎', '🔒',
      '💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '💿', '💡', '⏰', '⏱️', '📅', '🗓️',
      '📢', '📣', '✉️', '📧', '📦', '🏷️', '🔍', '🔎', '✏️', '✒️', '📝', '📋',
      '📐', '📏', '🖇️', '🗑️', '🗄️', '🗂️', '📬', '📭', '☎️', '📞', '📟', '📠'
    ]
  },
  {
    name: 'Symbols & Hearts',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
      '💞', '💓', '💗', '💖', '💘', '💝', '✨', '⭐', '🌟', '💫', '💥', '🔥',
      '⚡', '🎉', '🎊', '🏆', '🥇', '🥈', '🥉', '🎯', '🚀', '✅', '❌', '⚠️',
      '💯', '🟢', '🔴', '🟡', '🟠', '🟣', '⚫', '⚪', '🟩', '🟨', '🟧', '🟦'
    ]
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useDarkMode();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'profile' | 'settings'
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState(1);

  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  // Some realtime servers broadcast a sent event to every room member, including
  // the socket that sent it. Keep short-lived ids for optimistic messages so an
  // echoed event is not rendered again as an incoming message.
  const outgoingMessageIdsRef = useRef(new Set());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('room');
    const tabParam = params.get('tab');
    if (roomParam || tabParam === 'meetings' || location.pathname === '/meetings' || location.pathname === '/meeting') {
      setActiveTab('meetings');
    } else if (tabParam === 'profile' || location.pathname === '/profile') {
      setActiveTab('profile');
    } else if (tabParam === 'settings' || location.pathname === '/settings') {
      setActiveTab('settings');
    } else if (tabParam === 'chat' || location.pathname === '/chat') {
      setActiveTab('chat');
    }
  }, [location]);

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    const formatted = dateStr.replace(',', ' |');
    setCurrentDateFormatted(formatted);

    const user = getStoredUser();
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        role: user.role ? user.role.toUpperCase() : prev.role,
      }));
    }

    const socket = connectSocket();
    if (socket) {
      const handleIncoming = (data) => {
        console.log('Incoming call received:', data);
        setIncomingCall(data);
      };
      const handleRejected = () => {
        setIncomingCall(null);
      };

      const handleReceiveMessage = (data) => {
        console.log('[Chat] Received message:', data);

        const currentUser = getStoredUser();
        const senderId = data.senderId ?? data.sender?.id ?? data.userId;
        const currentUserId = currentUser?.id ?? currentUser?._id ?? currentUser?.userId;
        const isOwnEcho =
          (data.clientMessageId && outgoingMessageIdsRef.current.has(data.clientMessageId)) ||
          (senderId != null && currentUserId != null && String(senderId) === String(currentUserId));

        if (isOwnEcho) return;

        const incomingMsg = {
          id: data.id ?? data.messageId ?? Date.now() + Math.random(),
          sender: 'them',
          text: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const roomConversationId = Number(String(data.roomId || '').replace(/^room-/, ''));
        const conversationId = Number.isFinite(roomConversationId) && roomConversationId > 0
          ? roomConversationId
          : activeChatId;

        setConversations(prev => prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, incomingMsg],
              time: 'Just now',
              unread: c.id === activeChatId ? c.unread : c.unread + 1,
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
        socket.off('incoming-call', handleIncoming);
        socket.off('call-rejected', handleRejected);
        socket.off('receive-message', handleReceiveMessage);
        leaveRoom(`room-${activeChatId}`);
      };
    }
  }, [activeChatId]);

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callType, setCallType] = useState('video'); // 'video' | 'audio'
  const [incomingCall, setIncomingCall] = useState(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatListVisible, setIsChatListVisible] = useState(true);

  const handleStartCall = (type) => {
    setCallType(type);
    setIsCallOpen(true);
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit('call-user', {
        roomId: `room-${activeChat.id}`,
        callerName: profile.name,
        callerAvatar: '',
        callType: type,
      });
    }
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
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit('reject-call', { roomId: incomingCall.roomId });
      }
      setIncomingCall(null);
    }
  };

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('Smileys');
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const emojiPickerRef = useRef(null);

  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const attachmentMenuRef = useRef(null);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setIsEmojiPickerOpen(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(e.target)) {
        setIsAttachmentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectEmoji = (emoji) => {
    setMessageInput(prev => prev + emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    const isImage = file.type.startsWith('image/');

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    setSelectedFile({
      file,
      name: file.name,
      size: sizeFormatted,
      ext,
      type: isImage ? 'image' : 'document',
      previewUrl: isImage ? URL.createObjectURL(file) : null
    });

    setIsAttachmentMenuOpen(false);
    e.target.value = '';
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!messageInput.trim() && !selectedFile) return;

    const clientMessageId = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const newMsg = {
      id: clientMessageId,
      sender: 'me',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        ext: selectedFile.ext,
        type: selectedFile.type,
        previewUrl: selectedFile.previewUrl
      } : null
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          time: 'Just now'
        };
      }
      return c;
    }));

    const socket = getSocket();
    if (socket?.connected && messageInput.trim()) {
      outgoingMessageIdsRef.current.add(clientMessageId);
      socket.emit('send-message', {
        roomId: `room-${activeChatId}`,
        message: messageInput.trim(),
        clientMessageId,
      });

      // Do not retain ids indefinitely if a server does not echo the payload.
      window.setTimeout(() => outgoingMessageIdsRef.current.delete(clientMessageId), 30000);
    }

    setMessageInput('');
    setSelectedFile(null);
    setIsEmojiPickerOpen(false);
  };

  const renderDocumentIcon = (ext) => {
    switch (ext) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'XLS':
      case 'XLSX':
      case 'CSV':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'ZIP':
      case 'RAR':
      case 'TAR':
        return <FileArchive className="w-5 h-5 text-amber-500" />;
      case 'JS':
      case 'JSX':
      case 'TS':
      case 'HTML':
      case 'CSS':
      case 'JSON':
        return <FileCode className="w-5 h-5 text-teal-500" />;
      case 'PNG':
      case 'JPG':
      case 'JPEG':
      case 'GIF':
      case 'WEBP':
        return <ImageIcon className="w-5 h-5 text-violet-500" />;
      default:
        return <File className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />;
    }
  };

  const getAvatarInitial = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  const getAvatarBgColor = (name) => {
    const colorClasses = [
      'bg-[#b91c1c] ring-[#b91c1c]/30',
      'bg-blue-600 ring-blue-600/30',
      'bg-emerald-600 ring-emerald-600/30',
      'bg-violet-600 ring-violet-600/30',
      'bg-amber-600 ring-amber-600/30',
      'bg-rose-600 ring-rose-600/30',
      'bg-indigo-600 ring-indigo-600/30',
      'bg-teal-600 ring-teal-600/30',
    ];
    if (!name) return colorClasses[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorClasses[Math.abs(hash) % colorClasses.length];
  };

  const [profile, setProfile] = useState({
    name: 'Ujjwal Gupta',
    role: 'Lead Architect',
    email: 'ujjwal.gupta@flowbit.io',
    phone: '+1 (555) 349-2049',
    department: 'Engineering & Product',
    location: 'San Francisco, CA (Remote)',
    timezone: 'PST (UTC -8)',
    bio: 'Building next-generation distributed virtual workspace platforms and real-time collaboration engines.',
    status: 'Online'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const [isCompactView, setIsCompactView] = useState(false);

  const handleLogout = () => {
    navigate('/sign-in');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100 dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-100 font-sans select-none antialiased transition-colors duration-300">

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
      />

      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
        />
      )}

      <aside className={`hidden md:flex relative inset-y-0 left-0 z-30 shrink-0 bg-white dark:bg-[#0d0d10] border-r border-zinc-200 dark:border-[#1e1e24] flex-col justify-between py-5 transition-all duration-300 shadow-sm dark:shadow-none ${isSidebarCollapsed ? 'w-16 px-2' : 'w-56 px-3'
        }`}>
        <div>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} mb-8`}>
            {isSidebarCollapsed ? (
              <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
                <div>
                  <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                    Flow Bit
                  </h1>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Virtual Office</span>
                </div>
              </div>
            )}
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'chat'
                ? 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700/60 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              title={isSidebarCollapsed ? 'Chat' : undefined}
            >
              <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'chat' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              {!isSidebarCollapsed && <span>Chat</span>}
              {!isSidebarCollapsed && conversations.reduce((acc, c) => acc + c.unread, 0) > 0 && (
                <span className="ml-auto bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {conversations.reduce((acc, c) => acc + c.unread, 0)}
                </span>
              )}
              {isSidebarCollapsed && conversations.reduce((acc, c) => acc + c.unread, 0) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('meetings')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'meetings'
                ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 shadow-xs border border-amber-300/80 dark:border-amber-600/40 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
                }`}
              title={isSidebarCollapsed ? 'Meetings' : undefined}
            >
              <Video className={`w-4 h-4 shrink-0 ${activeTab === 'meetings' ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              {!isSidebarCollapsed && <span>Meetings</span>}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'profile'
                ? 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700/60 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              title={isSidebarCollapsed ? 'Profile' : undefined}
            >
              <User className={`w-4 h-4 shrink-0 ${activeTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              {!isSidebarCollapsed && <span>Profile</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'settings'
                ? 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700/60 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              title={isSidebarCollapsed ? 'Settings' : undefined}
            >
              <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              {!isSidebarCollapsed && <span>Settings</span>}
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-[#1e1e24] px-1 space-y-1.5">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer`}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer`}
            title={isSidebarCollapsed ? 'Log Out' : undefined}
          >
            <LogOut className="w-4 h-4 text-red-600 dark:text-red-500 rotate-180 shrink-0" />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      <aside className={`fixed md:hidden inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0d0d10] border-r border-zinc-200 dark:border-[#1e1e24] flex flex-col justify-between py-5 px-3 transition-transform duration-300 shadow-2xl ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div>
          <div className="flex items-center justify-between px-3 mb-8">
            <div className="flex items-center gap-3">
              <img src={brandLogo} alt="Flow Bit logo" className="w-9 h-9 object-contain" />
              <div>
                <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
                  Flow Bit
                </h1>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Virtual Office</span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('chat');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'chat'
                ? 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700/60 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === 'chat' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              <span>Chat</span>
              {conversations.reduce((acc, c) => acc + c.unread, 0) > 0 && (
                <span className="ml-auto bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {conversations.reduce((acc, c) => acc + c.unread, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('meetings');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'meetings'
                ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 shadow-xs border border-amber-300/80 dark:border-amber-600/40 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-amber-50/60 dark:hover:bg-amber-950/20'
                }`}
            >
              <Video className={`w-4 h-4 ${activeTab === 'meetings' ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              <span>Meetings</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'profile'
                ? 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700/60 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === 'settings'
                ? 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-950 dark:text-white shadow-xs border border-zinc-300 dark:border-zinc-700/60 font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-[#1e1e24] px-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-600 dark:text-red-500 rotate-180" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden pb-14 md:pb-0 bg-zinc-50 dark:bg-[#060608] transition-colors duration-300">

        <header className="h-16 shrink-0 border-b border-zinc-200 dark:border-[#1a1a20] bg-white dark:bg-[#0c0c0f] px-3.5 md:px-6 flex items-center justify-between z-10 transition-colors duration-300">
          <div className="flex items-center gap-2.5 md:gap-3.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl md:hidden cursor-pointer"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full ${getAvatarBgColor(profile.name)} text-white font-bold flex items-center justify-center text-xs md:text-sm shadow-md ring-2 transition-all shrink-0`}>
              {getAvatarInitial(profile.name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <span>Hello!</span>
                <span className="font-bold text-zinc-950 dark:text-white truncate max-w-[120px] sm:max-w-[200px]">{profile.name}</span>
              </div>
              <span className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 font-medium">User</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden sm:inline-block text-xs font-semibold text-zinc-600 dark:text-zinc-300 tracking-wide">
              {currentDateFormatted || 'Saturday | Oct 03, 2026'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Bright Light Mode' : 'Switch to Dark Mode'}
                className="w-12 h-6 rounded-full bg-emerald-500 p-0.5 flex items-center transition-all cursor-pointer shadow-sm relative focus:outline-none ring-2 ring-emerald-500/20"
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}>
                  {theme === 'dark' ? (
                    <Moon className="w-3 h-3 text-emerald-800" />
                  ) : (
                    <Sun className="w-3 h-3 text-amber-500" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">

          {activeTab === 'chat' && (
            <ChatSection>
              <div className="h-full flex overflow-hidden">

                <div className={`${!isChatListVisible ? 'hidden' : showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 border-r border-zinc-200 dark:border-[#1a1a20] bg-white dark:bg-[#0c0c0f] flex-col h-full transition-all duration-300`}>
                  <div className="p-3.5 sm:p-4 border-b border-zinc-200 dark:border-[#1a1a20]">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9.5 pr-4 py-2 bg-zinc-100 dark:bg-[#16161b] border border-zinc-300 dark:border-[#24242e] rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-[#17171d] p-2 space-y-1">
                    {conversations
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => {
                            setActiveChatId(chat.id);
                            setShowMobileChat(true);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id
                            ? 'bg-zinc-100 dark:bg-[#181820] border border-zinc-300 dark:border-[#2c2c38] shadow-xs'
                            : 'hover:bg-zinc-50 dark:hover:bg-[#121217] border border-transparent'
                            }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                            />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#0c0c0f] ${chat.status === 'online' ? 'bg-emerald-500' :
                              chat.status === 'away' ? 'bg-amber-500' : 'bg-zinc-400 dark:bg-zinc-500'
                              }`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{chat.name}</h4>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{chat.time}</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                              {chat.messages[chat.messages.length - 1]?.attachment ? (
                                `📎 [${chat.messages[chat.messages.length - 1].attachment.ext}] ${chat.messages[chat.messages.length - 1].attachment.name}`
                              ) : (
                                chat.messages[chat.messages.length - 1]?.text || chat.role
                              )}
                            </p>
                          </div>

                          {chat.unread > 0 && (
                            <span className="shrink-0 w-5 h-5 bg-emerald-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className={`${showMobileChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full bg-zinc-50 dark:bg-[#08080a] relative transition-colors duration-300`}>

                  <div className="h-14 shrink-0 px-3.5 md:px-6 border-b border-zinc-200 dark:border-[#1a1a20] bg-white/90 dark:bg-[#0c0c0f]/80 backdrop-blur flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <button
                        onClick={() => setShowMobileChat(false)}
                        className="p-1.5 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg md:hidden cursor-pointer"
                        title="Back to conversations"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsChatListVisible(!isChatListVisible)}
                        className="hidden md:flex p-1.5 -ml-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                        title={isChatListVisible ? 'Hide chat list' : 'Show chat list'}
                      >
                        {isChatListVisible ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                      </button>

                      <div className="relative">
                        <img
                          src={activeChat.avatar}
                          alt={activeChat.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                        />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#0c0c0f] ${activeChat.status === 'online' ? 'bg-emerald-500' :
                          activeChat.status === 'away' ? 'bg-amber-500' : 'bg-zinc-400 dark:bg-zinc-500'
                          }`} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-white">{activeChat.name}</h3>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${activeChat.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-500'
                            }`} />
                          {activeChat.status === 'online' ? 'Active Now' : 'Offline'} • {activeChat.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <button
                        onClick={() => handleStartCall('audio')}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="Voice Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartCall('video')}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="Video Meeting"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                      <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="text-center my-2">
                      <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-[#141418] px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-800">
                        Messages are end-to-end encrypted
                      </span>
                    </div>

                    {activeChat.messages.map((msg) => {
                      const isMe = msg.sender === 'me';
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            <img
                              src={activeChat.avatar}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700 mb-1"
                            />
                          )}

                          <div className={`max-w-md rounded-2xl p-2.5 text-xs shadow-xs ${isMe
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#18181f] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-[#262632] rounded-bl-xs'
                            }`}>

                            {msg.attachment && (
                              <div className="mb-2">
                                {msg.attachment.type === 'image' && msg.attachment.previewUrl ? (
                                  <div className="rounded-xl overflow-hidden mb-1.5 max-h-60 bg-black/10">
                                    <img
                                      src={msg.attachment.previewUrl}
                                      alt={msg.attachment.name}
                                      className="w-full h-auto object-cover max-h-56 hover:opacity-95 transition-opacity"
                                    />
                                  </div>
                                ) : (
                                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isMe
                                    ? 'bg-emerald-700/70 border-emerald-500/40 text-white'
                                    : 'bg-zinc-100 dark:bg-[#14141a] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white'
                                    }`}>
                                    <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-xs">
                                      {renderDocumentIcon(msg.attachment.ext)}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                      <h5 className="font-bold text-xs truncate leading-tight">
                                        {msg.attachment.name}
                                      </h5>
                                      <span className={`text-[10px] font-medium ${isMe ? 'text-emerald-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                        {msg.attachment.size} • {msg.attachment.ext}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      title="Download document"
                                      className={`p-2 rounded-lg transition-transform active:scale-90 cursor-pointer ${isMe
                                        ? 'bg-emerald-800/80 hover:bg-emerald-900 text-white'
                                        : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                                        }`}
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {msg.text && (
                              <p className="leading-relaxed px-1 font-normal text-xs">{msg.text}</p>
                            )}

                            <div className={`flex items-center justify-end gap-1 mt-1 px-1 text-[9px] ${isMe ? 'text-emerald-200' : 'text-zinc-400 dark:text-zinc-500'}`}>
                              <span>{msg.time}</span>
                              {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {selectedFile && (
                    <div className="px-4 py-2 bg-zinc-100 dark:bg-[#121217] border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                          {renderDocumentIcon(selectedFile.ext)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            {selectedFile.size} • Ready to send
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {isEmojiPickerOpen && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-16 left-6 w-80 max-h-96 rounded-2xl bg-white dark:bg-[#14141a] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 z-50 flex flex-col animate-fadeIn"
                    >
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          placeholder="Search emoji..."
                          value={emojiSearchQuery}
                          onChange={(e) => setEmojiSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-100 dark:bg-[#1c1c24] border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-2 overflow-x-auto">
                        {EMOJI_CATEGORIES.map(cat => (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => setSelectedEmojiCategory(cat.name)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg shrink-0 cursor-pointer transition-colors ${selectedEmojiCategory === cat.name
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      <div className="flex-1 overflow-y-auto max-h-56 grid grid-cols-7 gap-1 p-1">
                        {EMOJI_CATEGORIES.find(c => c.name === selectedEmojiCategory)?.emojis
                          .filter(e => emojiSearchQuery ? e.includes(emojiSearchQuery) : true)
                          .map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectEmoji(emoji)}
                              className="w-9 h-9 text-lg rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                  {isAttachmentMenuOpen && (
                    <div
                      ref={attachmentMenuRef}
                      className="absolute bottom-16 left-4 w-52 rounded-2xl bg-white dark:bg-[#14141a] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn"
                    >
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span>Document / File</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span>Photos & Videos</span>
                      </button>
                    </div>
                  )}

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-zinc-200 dark:border-[#1a1a20] bg-white dark:bg-[#0c0c0f] flex items-center gap-3 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 relative">
                      <button
                        type="button"
                        onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
                        title="Attach Document or Media"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                        className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer ${isEmojiPickerOpen ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'hover:text-zinc-900 dark:hover:text-white'
                          }`}
                        title="Insert Emojis"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder={`Message ${activeChat.name}...`}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 bg-zinc-100 dark:bg-[#15151a] border border-zinc-300 dark:border-[#24242e] rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={!messageInput.trim() && !selectedFile}
                      className="p-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 disabled:opacity-40 text-white dark:text-black font-bold rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </ChatSection>
          )}

          {activeTab === 'meetings' && (
            <MeetingsSection>
              <MeetingsDashboard
                userProfile={profile}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            </MeetingsSection>
          )}

          {activeTab === 'profile' && (
            <ProfileSection>
              <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
                {profileSavedToast && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Profile updated successfully!
                  </div>
                )}

                <div className="relative rounded-2xl bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] overflow-hidden mb-6 shadow-sm dark:shadow-none transition-colors duration-300">
                  <div className="h-32 bg-gradient-to-r from-zinc-200 via-zinc-300 to-emerald-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-emerald-950 border-b border-zinc-200 dark:border-zinc-800" />

                  <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
                    <div className="flex items-end gap-4">
                      <div className="relative group">
                        <div className={`w-24 h-24 rounded-2xl ${getAvatarBgColor(profile.name)} text-white font-black text-3xl flex items-center justify-center border-4 border-white dark:border-[#0f0f14] shadow-xl transition-all`}>
                          {getAvatarInitial(profile.name)}
                        </div>
                        <button className="absolute bottom-1 right-1 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-600 transition-colors cursor-pointer">
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="pb-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{profile.name}</h2>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            {profile.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{profile.role} • {profile.department}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">Full Name</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">Email Address</label>
                        <input
                          type="email"
                          disabled={!isEditingProfile}
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">Job Title</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.role}
                          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">Department</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.department}
                          onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">Location</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">About Bio</label>
                        <textarea
                          rows={3}
                          disabled={!isEditingProfile}
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white dark:text-black text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Security & Authentication
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-zinc-200 dark:border-zinc-800 text-xs">
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white">Password</h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Last changed 3 weeks ago</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/reset-password')}
                        className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white font-medium transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        Change Password
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 text-xs">
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Enhanced security with authenticator app</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-md font-bold text-[10px] self-start sm:self-auto">
                        Enabled
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </ProfileSection>
          )}

          {activeTab === 'settings' && (
            <SettingsSection>
              <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Preferences & Settings</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Manage your workspace configuration and notification preferences</p>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Interface Theme</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                          onClick={() => theme !== 'dark' && toggleTheme()}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${theme === 'dark'
                            ? 'bg-zinc-800/80 border-emerald-500/80 ring-1 ring-emerald-500/40 text-white'
                            : 'bg-zinc-50 dark:bg-[#15151b] border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center">
                              <Moon className="w-4 h-4 text-emerald-400" />
                            </div>
                            {theme === 'dark' && (
                              <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Pure Dark Mode</h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Optimized high contrast deep black palette</p>
                        </div>

                        <div
                          onClick={() => theme !== 'light' && toggleTheme()}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${theme === 'light'
                            ? 'bg-zinc-100 border-emerald-600 ring-1 ring-emerald-600/40'
                            : 'bg-zinc-50 dark:bg-[#15151b] border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center">
                              <Sun className="w-4 h-4 text-amber-600" />
                            </div>
                            {theme === 'light' && (
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Bright Light Mode</h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Crisp modern light workspace</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Display Density</h3>
                      <div className="flex items-center justify-between py-2 text-xs">
                        <div>
                          <h4 className="font-semibold text-zinc-900 dark:text-white">Compact Mode</h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Reduce paddings and list heights for higher density</p>
                        </div>
                        <button
                          onClick={() => setIsCompactView((value) => !value)}
                          className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${isCompactView ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-800'
                            }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isCompactView ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                </div>

              </div>
            </SettingsSection>
          )}

        </main>
      </div>

      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-40 h-14 bg-white/95 dark:bg-[#0c0c0f]/95 backdrop-blur-md border-t border-zinc-200 dark:border-[#1a1a20] flex items-center justify-around px-2">
        <button
          onClick={() => { setActiveTab('chat'); setShowMobileChat(false); }}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'chat'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-500 dark:text-zinc-400'
            }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Chat</span>
          {conversations.reduce((acc, c) => acc + c.unread, 0) > 0 && (
            <span className="absolute top-1 right-1/4 w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'meetings'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-zinc-500 dark:text-zinc-400'
            }`}
        >
          <Video className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Meetings</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'profile'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-500 dark:text-zinc-400'
            }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors cursor-pointer ${activeTab === 'settings'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-500 dark:text-zinc-400'
            }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Settings</span>
        </button>
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
