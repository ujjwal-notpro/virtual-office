import React, { useState } from 'react';
import { Mail, User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import SocialAuth from '../components/auth/SocialAuth';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    fullName: '',
    password: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.fullName || !formData.password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (!formData.agreeToTerms) {
      setErrorMessage('Please agree to the User Agreement and Privacy Policy');
      return;
    }

    setIsLoading(true);
    // Simulate sign-up registration
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <AuthLayout title="Sign Up" backTo="/">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50">
            {errorMessage}
          </div>
        )}

        {/* Identifier Field */}
        <AuthInput
          id="identifier"
          name="identifier"
          type="text"
          placeholder="Phone/Email Id"
          icon={Mail}
          value={formData.identifier}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        {/* Full Name Field */}
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

        {/* Password Field */}
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

        {/* Terms and Privacy Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-zinc-700 text-blue-600 dark:text-black focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600 dark:accent-white"
          />
          <label
            htmlFor="agreeToTerms"
            className="text-[12px] leading-relaxed text-gray-600 dark:text-zinc-400 cursor-pointer select-none"
          >
            I Have Read And Agree To{' '}
            <span className="font-semibold text-gray-900 dark:text-white underline hover:text-blue-600">
              User Agreement
            </span>{' '}
            &{' '}
            <span className="font-semibold text-gray-900 dark:text-white underline hover:text-blue-600">
              Privacy Policy
            </span>
          </label>
        </div>

        {/* Continue CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-[15px] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
            ) : (
              'Continue'
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-gray-200 dark:border-zinc-800" />
          <span className="absolute px-3 bg-white dark:bg-[#101010] text-xs font-medium text-gray-400 dark:text-zinc-500 tracking-wider">
            OR
          </span>
        </div>

        {/* Social Authentication */}
        <SocialAuth />

        {/* Bottom Switch Link */}
        <div className="text-center pt-2 text-[13px] text-gray-600 dark:text-zinc-400 font-medium">
          Joined us before?{' '}
          <Link
            to="/sign-in"
            className="text-blue-600 dark:text-white font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
