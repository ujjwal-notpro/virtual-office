import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = false,
  autoComplete,
  id,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4.5 text-gray-400 dark:text-zinc-500 pointer-events-none flex items-center justify-center">
            <Icon className="w-5 h-5 stroke-[1.75]" />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`w-full py-3.5 ${
            Icon ? 'pl-12' : 'pl-5'
          } ${
            isPassword ? 'pr-12' : 'pr-5'
          } bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 text-[15px] font-medium rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus:outline-none focus:border-blue-500 dark:focus:border-zinc-300 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-white/10 transition-all duration-200`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300 transition-colors p-1 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 stroke-[1.75]" />
            ) : (
              <Eye className="w-5 h-5 stroke-[1.75]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
