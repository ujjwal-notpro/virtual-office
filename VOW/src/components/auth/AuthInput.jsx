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
    <div className="relative w-full group">
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 dark:text-zinc-500 group-focus-within:text-black dark:group-focus-within:text-zinc-200 pointer-events-none flex items-center justify-center transition-colors duration-200">
            <Icon className="w-5 h-5 stroke-[1.8]" />
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
            Icon ? 'pl-11' : 'pl-4.5'
          } ${
            isPassword ? 'pr-11' : 'pr-4.5'
          } bg-slate-50/90 dark:bg-black/80 hover:bg-slate-50 dark:hover:bg-zinc-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-[14.5px] font-medium rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-zinc-300 focus:ring-4 focus:ring-black/10 dark:focus:ring-white/10 transition-all duration-200`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-colors cursor-pointer rounded-lg hover:bg-slate-200/60 dark:hover:bg-zinc-800"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4.5 h-4.5 stroke-[1.8]" />
            ) : (
              <Eye className="w-4.5 h-4.5 stroke-[1.8]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;

