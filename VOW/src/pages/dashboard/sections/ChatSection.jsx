import { useState, useRef, useEffect } from 'react';
import {
  Search, Send, Smile, Phone, Video, MoreVertical,
  Check, CheckCheck, Download, Image as ImageIcon,
  File, X, FileText, FileSpreadsheet, FileArchive,
  FileCode, ArrowLeft, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { getAvatarInitial, getAvatarBgColor } from '../utils/avatarHelpers';
import { EMOJI_CATEGORIES } from '../data/emojiCategories';
import { getSocket } from '../../../services/socket';

function renderDocumentIcon(ext) {
  switch (ext) {
    case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
    case 'XLS': case 'XLSX': case 'CSV':
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    case 'ZIP': case 'RAR': case 'TAR':
      return <FileArchive className="w-5 h-5 text-amber-500" />;
    case 'JS': case 'JSX': case 'TS': case 'HTML': case 'CSS': case 'JSON':
      return <FileCode className="w-5 h-5 text-teal-500" />;
    case 'PNG': case 'JPG': case 'JPEG': case 'GIF': case 'WEBP':
      return <ImageIcon className="w-5 h-5 text-violet-500" />;
    default:
      return <File className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />;
  }
}

export default function ChatSection({
  conversations,
  setConversations,
  activeChatId,
  setActiveChatId,
  profile,
  outgoingMessageIdsRef,
  onStartCall,
}) {
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('Smileys');
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
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
      file, name: file.name, size: sizeFormatted, ext,
      type: isImage ? 'image' : 'document',
      previewUrl: isImage ? URL.createObjectURL(file) : null
    });
    e.target.value = '';
  };

  const removeSelectedFile = () => setSelectedFile(null);

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
        name: selectedFile.name, size: selectedFile.size,
        ext: selectedFile.ext, type: selectedFile.type,
        previewUrl: selectedFile.previewUrl
      } : null
    };
    setConversations(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, newMsg], time: 'Just now' };
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
      window.setTimeout(() => outgoingMessageIdsRef.current.delete(clientMessageId), 30000);
    }
    setMessageInput('');
    setSelectedFile(null);
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="h-full flex overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="*/*" />

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
                onClick={() => { setActiveChatId(chat.id); setShowMobileChat(true); }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${activeChatId === chat.id
                  ? 'bg-zinc-100 dark:bg-[#181820] border border-zinc-300 dark:border-[#2c2c38] shadow-xs'
                  : 'hover:bg-zinc-50 dark:hover:bg-[#121217] border border-transparent'
                  }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full ${getAvatarBgColor(chat.name)} text-white font-bold flex items-center justify-center text-sm`}>
                    {getAvatarInitial(chat.name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{chat.name}</h4>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {chat.messages && chat.messages.length > 0 ? (
                      chat.messages[chat.messages.length - 1]?.attachment
                        ? `📎 [${chat.messages[chat.messages.length - 1].attachment.ext}] ${chat.messages[chat.messages.length - 1].attachment.name}`
                        : (chat.messages[chat.messages.length - 1]?.text || chat.role)
                    ) : (chat.role || 'No messages yet')}
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
              <div className={`w-9 h-9 rounded-full ${getAvatarBgColor(activeChat.name)} text-white font-bold flex items-center justify-center text-xs`}>
                {getAvatarInitial(activeChat.name)}
              </div>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#0c0c0f] ${activeChat.status === 'online' ? 'bg-emerald-500' : activeChat.status === 'away' ? 'bg-amber-500' : 'bg-zinc-400 dark:bg-zinc-500'}`} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white">{activeChat.name}</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${activeChat.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-400 dark:bg-zinc-500'}`} />
                {activeChat.status === 'online' ? 'Active Now' : 'Offline'} • {activeChat.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <button onClick={() => onStartCall?.('audio')} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" title="Voice Call">
              <Phone className="w-4 h-4" />
            </button>
            <button onClick={() => onStartCall?.('video')} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer" title="Video Meeting">
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

          {(!activeChat?.messages || activeChat.messages.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className={`w-14 h-14 rounded-full ${getAvatarBgColor(activeChat?.name || 'User')} text-white font-bold flex items-center justify-center text-xl`}>
                {getAvatarInitial(activeChat?.name || 'U')}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{activeChat?.name}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">No messages yet. Send a message to start chatting!</p>
              </div>
            </div>
          )}

          {(activeChat?.messages || []).map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className={`w-7 h-7 rounded-full ${getAvatarBgColor(activeChat.name)} text-white font-bold flex items-center justify-center text-[10px] mb-1 shrink-0`}>
                    {getAvatarInitial(activeChat.name)}
                  </div>
                )}
                <div className={`max-w-md rounded-2xl p-2.5 text-xs shadow-xs ${isMe
                  ? 'bg-emerald-600 text-white rounded-br-xs'
                  : 'bg-white dark:bg-[#18181f] text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-[#262632] rounded-bl-xs'
                  }`}>
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.type === 'image' && msg.attachment.previewUrl ? (
                        <div className="rounded-xl overflow-hidden mb-1.5 max-h-60 bg-black/10">
                          <img src={msg.attachment.previewUrl} alt={msg.attachment.name} className="w-full h-auto object-cover max-h-56 hover:opacity-95 transition-opacity" />
                        </div>
                      ) : (
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isMe ? 'bg-emerald-700/70 border-emerald-500/40 text-white' : 'bg-zinc-100 dark:bg-[#14141a] border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white'}`}>
                          <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-xs">
                            {renderDocumentIcon(msg.attachment.ext)}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <h5 className="font-bold text-xs truncate leading-tight">{msg.attachment.name}</h5>
                            <span className={`text-[10px] font-medium ${isMe ? 'text-emerald-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                              {msg.attachment.size} • {msg.attachment.ext}
                            </span>
                          </div>
                          <button type="button" title="Download document" className={`p-2 rounded-lg transition-transform active:scale-90 cursor-pointer ${isMe ? 'bg-emerald-800/80 hover:bg-emerald-900 text-white' : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'}`}>
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {msg.text && <p className="leading-relaxed px-1 font-normal text-xs">{msg.text}</p>}
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
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{selectedFile.size} • Ready to send</p>
              </div>
            </div>
            <button type="button" onClick={removeSelectedFile} className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-500 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isEmojiPickerOpen && (
          <div ref={emojiPickerRef} className="absolute bottom-16 left-6 w-80 max-h-96 rounded-2xl bg-white dark:bg-[#14141a] border border-zinc-200 dark:border-zinc-800 shadow-2xl p-3 z-50 flex flex-col animate-fadeIn">
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

        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-zinc-200 dark:border-[#1a1a20] bg-white dark:bg-[#0c0c0f] flex items-center gap-3 transition-colors duration-300"
        >
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 relative">
            <button
              type="button"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer ${isEmojiPickerOpen ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' : 'hover:text-zinc-900 dark:hover:text-white'}`}
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
  );
}
