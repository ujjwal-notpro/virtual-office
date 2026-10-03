import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMessage('Please fill in both password fields');
      return;
    }
    if (formData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    // Simulate reset flow
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/sign-in');
      }, 2200);
    }, 700);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={isSuccess ? undefined : 'Enter and confirm your new password below.'}
      backTo="/sign-in"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Password Reset Successful!
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Your password has been updated. Redirecting to Sign In...
          </p>
          <div className="pt-3">
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-sm shadow-md transition-all"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 flex items-center justify-between animate-fadeIn">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Enter New Password */}
          <AuthInput
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter New Password"
            icon={Lock}
            value={formData.newPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          {/* Confirm New Password */}
          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          {/* Submit CTA Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Back to Sign In Link */}
          <div className="text-center pt-3 text-[13px] text-slate-600 dark:text-zinc-400 font-medium">
            Remember your password?{' '}
            <Link
              to="/sign-in"
              className="text-black dark:text-white font-bold hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;

