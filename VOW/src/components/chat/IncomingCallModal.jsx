import React from 'react';
import { Phone, PhoneOff, Video, Sparkles } from 'lucide-react';

export default function IncomingCallModal({
  isOpen,
  incomingCall,
  onAccept,
  onDecline
}) {
  if (!isOpen || !incomingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Ringing Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl pointer-events-none animate-pulse" />

        {/* Avatar with Pulsing Rings */}
        <div className="relative mx-auto w-24 h-24 pt-2">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="absolute -inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
          <img
            src={
              incomingCall.callerAvatar ||
              'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=600&auto=format&fit=crop&q=60'
            }
            alt={incomingCall.callerName}
            className="relative w-full h-full rounded-full object-cover border-4 border-zinc-800 shadow-xl"
          />
          <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 ring-4 ring-zinc-950 text-black">
            {incomingCall.callType === 'video' ? (
              <Video className="w-3.5 h-3.5" />
            ) : (
              <Phone className="w-3.5 h-3.5" />
            )}
          </span>
        </div>

        {/* Call Info */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">{incomingCall.callerName || 'Incoming Caller'}</h3>
          <p className="text-xs text-zinc-400 font-medium">
            Incoming {incomingCall.callType === 'video' ? 'HD Video Call' : 'Voice Call'}...
          </p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400 font-semibold">
            {incomingCall.roomId}
          </span>
        </div>

        {/* Action Buttons: Decline / Accept */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {/* Decline */}
          <button
            onClick={onDecline}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 active:scale-95 transition-all">
              <PhoneOff className="w-6 h-6" />
            </div>
            <span className="text-xs text-zinc-400 font-medium">Decline</span>
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 active:scale-95 transition-all animate-bounce">
              {incomingCall.callType === 'video' ? (
                <Video className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </div>
            <span className="text-xs text-emerald-400 font-medium font-semibold">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
}
