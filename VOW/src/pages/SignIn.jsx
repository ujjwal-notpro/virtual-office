import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import { loginAndSave } from '../services/api';
import { connectSocket } from '../services/socket';

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier.trim() || !formData.password) {
      setErrorMessage('Please fill in your email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await loginAndSave({
        email: formData.identifier.trim(),
        password: formData.password,
      });

      try {
        connectSocket();
      } catch (sockErr) {
        console.warn('Socket connect error:', sockErr);
      }

      setSuccessMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 200);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please check your email and password.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to continue." backTo="/" showBrandImage>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 flex items-center justify-between animate-fadeIn">
            <span>{errorMessage}</span>
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

        {successMessage && (
          <div className="p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between animate-fadeIn">
            <span>{successMessage}</span>
          </div>
        )}

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
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-2 text-[13px] text-slate-600 dark:text-zinc-400 font-medium">
          New to Flow Bit?{' '}
          <Link to="/sign-up" className="text-black dark:text-white font-bold hover:underline ml-1">
            Register
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;