import { User, Camera, Edit3, Save, Check } from 'lucide-react';
import { getAvatarInitial, getAvatarBgColor } from '../utils/avatarHelpers';

export default function ProfileSection({ profile, setProfile, isEditingProfile, setIsEditingProfile, profileSavedToast, onSave }) {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      {profileSavedToast && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Profile updated successfully!
        </div>
      )}

      <div className="relative rounded-2xl bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] overflow-hidden mb-6 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="h-32 bg-gradient-to-r from-zinc-200 via-zinc-300 to-emerald-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-emerald-950 border-b border-zinc-200 dark:border-zinc-800" />
        <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-2xl ${getAvatarBgColor(profile.name)} text-white font-black text-3xl flex items-center justify-center border-4 border-white dark:border-[#0f0f14] shadow-xl transition-all`}>
                {getAvatarInitial(profile.name)}
              </div>
              <button className="absolute bottom-1 right-1 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-600 transition-colors cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{profile.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  {profile.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{profile.role} • {profile.department}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="bg-white dark:bg-[#0f0f14] border border-zinc-200 dark:border-[#22222c] rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email Address', key: 'email', type: 'email' },
              { label: 'Phone Number', key: 'phone', type: 'text' },
              { label: 'Job Title', key: 'role', type: 'text' },
              { label: 'Department', key: 'department', type: 'text' },
              { label: 'Location', key: 'location', type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">{label}</label>
                <input
                  type={type}
                  disabled={!isEditingProfile}
                  value={profile[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-zinc-600 dark:text-zinc-400 font-medium mb-1.5">About Bio</label>
              <textarea
                rows={3}
                disabled={!isEditingProfile}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-zinc-100 dark:bg-[#16161c] border border-zinc-300 dark:border-zinc-800 disabled:opacity-70 rounded-xl px-3.5 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>

          {isEditingProfile && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white dark:text-black text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
