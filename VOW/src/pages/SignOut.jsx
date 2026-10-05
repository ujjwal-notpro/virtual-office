import React, { useState } from 'react';
import { LogOut, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { clearAuth } from '../services/api';
import { disconnectSocket } from '../services/socket';

const SignOut = () => {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmSignOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      clearAuth();
      disconnectSocket();
      setIsLoading(false);
      setIsLoggedOut(true);
    }, 600);
  };

  return (
    <AuthLayout
      title={isLoggedOut ? "Signed Out" : "Sign Out"}
      showBrandImage
      subtitle={
        isLoggedOut
          ? "You have been safely signed out."
          : "Are you sure you want to sign out of your session?"
      }
      backTo="/"
    >
      {isLoggedOut ? (
        <div className="py-4 text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              See you again soon!
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400">
              Your session has ended securely. You can sign back in at any time.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              to="/sign-in"
              className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In Again</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold text-[14px] transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-2 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/10">
            <LogOut className="w-8 h-8" />
          </div>

          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Signing out will disconnect your active workspace presence and notify your team that you are away.
          </p>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmSignOut}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-[15px] shadow-[0_4px_16px_rgba(220,38,38,0.25)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Confirm Sign Out</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold text-[14px] transition-colors cursor-pointer"
            >
              Cancel & Stay Signed In
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default SignOut;
