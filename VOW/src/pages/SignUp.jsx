import React, { useState } from 'react';
import { Mail, User, Lock, ArrowRight, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import { registerUser, saveAuth } from '../services/api';
import { connectSocket } from '../services/socket';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    fullName: '',
    phone: '',
    password: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.fullName.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    if (!formData.agreeToTerms) {
      setErrorMessage('Please agree to the User Agreement and Privacy Policy');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const email = formData.identifier.trim();
      const registered = await registerUser({
        name: formData.fullName.trim(),
        email,
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'employee',
      });

      const token = registered?.token || registered?.accessToken || registered?.data?.token;
      const user = registered?.user || registered?.data?.user;
      if (token && user) {
        saveAuth(token, user);
      }

      try {
        connectSocket();
      } catch (sockErr) {
        console.warn('Socket connect error:', sockErr);
      }

      setSuccessMessage('Account created! Taking you to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 200);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Create your workspace account in seconds."
      backTo="/"
      showBrandImage
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 flex items-center justify-between animate-fadeIn">
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between animate-fadeIn">
            <span>{successMessage}</span>
          </div>
        )}

        <AuthInput
          id="identifier"
          name="identifier"
          type="text"
          placeholder="Email Id"
          icon={Mail}
          value={formData.identifier}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <AuthInput
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Full Name"
          icon={User}
          value={formData.fullName}
          onChange={handleChange}
          required
          autoComplete="name"
        />

        <AuthInput
          id="phone"
          name="phone"
          type="tel"
          placeholder="Phone Number (optional)"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
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
          autoComplete="new-password"
        />

        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-zinc-700 text-black focus:ring-black focus:ring-offset-0 cursor-pointer accent-black dark:accent-white"
          />
          <label
            htmlFor="agreeToTerms"
            className="text-[12px] leading-relaxed text-slate-600 dark:text-zinc-400 cursor-pointer select-none"
          >
            I Have Read And Agree To{' '}
            <span className="font-semibold text-black dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">
              User Agreement
            </span>{' '}
            &{' '}
            <span className="font-semibold text-black dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">
              Privacy Policy
            </span>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>


        <div className="text-center pt-2 text-[13px] text-slate-600 dark:text-zinc-400 font-medium">
          Joined us before?{' '}
          <Link
            to="/sign-in"
            className="text-black dark:text-white font-bold hover:underline ml-1"
          >
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;