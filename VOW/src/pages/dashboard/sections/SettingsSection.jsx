import { Sun, Moon, Check } from 'lucide-react';

export default function SettingsSection({ theme, toggleTheme }) {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Preferences &amp; Settings</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your workspace configuration and notification preferences
        </p>
      </div>

      <div className="space-y-4">

        <div className="bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Interface Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${theme === 'dark'
                ? 'bg-zinc-800/80 border-emerald-500/80 ring-1 ring-emerald-500/40 text-white'
                : 'bg-zinc-50 dark:bg-[#15151b] border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-emerald-400" />
                </div>
                {theme === 'dark' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Pure Dark Mode</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Optimized high contrast deep black palette</p>
            </div>

            <div
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${theme === 'light'
                ? 'bg-zinc-100 border-emerald-600 ring-1 ring-emerald-600/40'
                : 'bg-zinc-50 dark:bg-[#15151b] border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>
                {theme === 'light' && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Bright Light Mode</h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Crisp modern light workspace</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
