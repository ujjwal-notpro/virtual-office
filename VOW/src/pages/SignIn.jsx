import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, MailCheck, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import SocialAuth from '../components/auth/SocialAuth';
import { sendOTP, verifyOTP, saveAuth } from '../services/api';
import { connectSocket } from '../services/socket';

const SignIn = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('credentials');

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [otpData, setOtpData] = useState({
    userId: '',
    otp: ['', '', '', '', '', ''],
    method: 'email', // 'email' or 'sms'
    maskedTarget: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    setErrorMessage('');
    setStep('otp-method');
  };

  const handleSendOTP = async (method) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await sendOTP({
        email: formData.identifier,
        password: formData.password,
        method: method,
      });

      setOtpData((prev) => ({
        ...prev,
        userId: response.userId,
        method: method,
        maskedTarget: response.message,
        otp: ['', '', '', '', '', ''],
      }));

      setSuccessMessage(response.message);
      setCountdown(60);
      setStep('otp-verify');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send OTP';
      setErrorMessage(msg);
      if (error.response?.status === 401 || error.response?.status === 404) {
        setStep('credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otpData.otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtpData((prev) => ({ ...prev, otp: newOtp }));

    if (errorMessage) setErrorMessage('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtpData((prev) => ({ ...prev, otp: newOtp }));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otpData.otp.join('');
    if (otpString.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await verifyOTP({
        userId: otpData.userId,
        otp: otpString,
      });

      saveAuth(response.token, response.user);

      connectSocket();

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP verification failed';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    handleSendOTP(otpData.method);
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setErrorMessage('');
    setSuccessMessage('');
    setOtpData({ userId: '', otp: ['', '', '', '', '', ''], method: 'email', maskedTarget: '' });
  };

  if (step === 'credentials') {
    return (
      <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to continue." backTo="/">
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 flex items-center justify-between animate-fadeIn">
              <span>{errorMessage}</span>
            </div>
          )}

          <AuthInput
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Phone/Email Id"
            icon={Mail}
            value={formData.identifier}
            onChange={handleChange}
            required
            autoComplete="username"
          />

          <AuthInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            icon={Lock}
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end pt-0.5">
            <Link
              to="/reset-password"
              className="text-[13px] font-semibold text-black dark:text-zinc-300 hover:text-zinc-600 dark:hover:text-white transition-colors hover:underline"
            >
              Forgotten Password?
            </Link>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="relative flex items-center justify-center py-2.5">
            <div className="w-full border-t border-slate-200/90 dark:border-zinc-800" />
            <span className="absolute px-3 bg-white dark:bg-[#0f0f12] text-[11px] font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">
              OR
            </span>
          </div>

          <SocialAuth />

          <div className="text-center pt-2 text-[13px] text-slate-600 dark:text-zinc-400 font-medium">
            New to Flow Bit?{' '}
            <Link to="/sign-up" className="text-black dark:text-white font-bold hover:underline ml-1">
              Register
            </Link>
          </div>
        </form>
      </AuthLayout>
    );
  }

  if (step === 'otp-method') {
    return (
      <AuthLayout title="Verify Identity" subtitle="Choose how you'd like to receive your OTP code." backTo="/">
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 animate-fadeIn">
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={() => handleSendOTP('email')}
            disabled={isLoading}
            className="w-full p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/90 dark:bg-black/80 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:border-black dark:hover:border-zinc-500 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-4 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
              <MailCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">Send to Email</p>
              <p className="text-[12px] text-slate-500 dark:text-zinc-500 mt-0.5">OTP will be sent to your registered email</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-zinc-600 ml-auto group-hover:translate-x-0.5 group-hover:text-black dark:group-hover:text-white transition-all" />
          </button>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-4 h-4 border-2 border-slate-300 dark:border-zinc-600 border-t-black dark:border-t-white rounded-full animate-spin" />
              <span className="text-[13px] text-slate-500 dark:text-zinc-400 font-medium">Sending OTP...</span>
            </div>
          )}

          <button
            onClick={handleBackToCredentials}
            className="w-full text-center text-[13px] text-slate-500 dark:text-zinc-500 font-semibold hover:text-black dark:hover:text-white transition-colors cursor-pointer pt-2"
          >
            ← Back to Sign In
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Enter OTP" subtitle={successMessage || 'Enter the 6-digit code sent to you.'} backTo="/">
      <form onSubmit={handleVerifyOTP} className="space-y-5">
        {errorMessage && (
          <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 animate-fadeIn">
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/30 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
          {otpData.otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200/90 dark:border-zinc-800 bg-slate-50/90 dark:bg-black/80 text-slate-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-zinc-300 focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all duration-200"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-[13px] text-slate-500 dark:text-zinc-500 font-medium">
              Resend OTP in <span className="font-bold text-black dark:text-white">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-[13px] text-black dark:text-white font-semibold hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resend OTP
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleBackToCredentials}
          className="w-full text-center text-[13px] text-slate-500 dark:text-zinc-500 font-semibold hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Sign In
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
