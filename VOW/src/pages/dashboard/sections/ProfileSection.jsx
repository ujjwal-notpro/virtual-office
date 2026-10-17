import { User, Camera, Edit3, Save, Check } from 'lucide-react';
import { getAvatarInitial, getAvatarBgColor } from '../utils/avatarHelpers';

export default function ProfileSection({ profile, setProfile, isEditingProfile, setIsEditingProfile, profileSavedToast, onSave }) {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      {profileSavedToast && (
        <div className="mb-6 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn" style={{ backgroundColor: 'rgba(23,77,56,0.1)', border: '1px solid rgba(23,77,56,0.4)', color: '#174D38' }}>
          <Check className="w-4 h-4" style={{ color: '#174D38' }} />
          Profile updated successfully!
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-sm transition-colors duration-300" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5' }}>
        <div className="h-32" style={{ background: 'linear-gradient(to right, #CBCBCB, #e5e5e5, #174D38)', borderBottom: '1px solid #e5e5e5' }} />
        <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-2xl ${getAvatarBgColor(profile.name)} text-white font-black text-3xl flex items-center justify-center shadow-xl transition-all`} style={{ border: '4px solid #ffffff' }}>
                {getAvatarInitial(profile.name)}
              </div>
              <button className="absolute bottom-1 right-1 p-1.5 rounded-lg transition-colors cursor-pointer" style={{ backgroundColor: '#174D38', color: '#ffffff', border: '1px solid rgba(23,77,56,0.6)' }}>
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>{profile.name}</h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(23,77,56,0.1)', border: '1px solid rgba(23,77,56,0.3)', color: '#174D38' }}>
                  {profile.status}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#CBCBCB' }}>{profile.role} • {profile.department}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
            style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="rounded-2xl p-6 shadow-sm transition-colors duration-300" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5' }}>
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
            <User className="w-4 h-4" style={{ color: '#174D38' }} />
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
                <label className="block font-medium mb-1.5" style={{ color: '#CBCBCB' }}>{label}</label>
                <input
                  type={type}
                  disabled={!isEditingProfile}
                  value={profile[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  className="w-full disabled:opacity-70 rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                  style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block font-medium mb-1.5" style={{ color: '#CBCBCB' }}>About Bio</label>
              <textarea
                rows={3}
                disabled={!isEditingProfile}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full disabled:opacity-70 rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors resize-none"
                style={{ backgroundColor: '#F2F2F2', border: '1px solid #e5e5e5', color: '#1a1a1a' }}
              />
            </div>
          </div>

          {isEditingProfile && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                style={{ backgroundColor: '#F2F2F2', color: '#666' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                style={{ backgroundColor: '#174D38', color: '#ffffff' }}
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
