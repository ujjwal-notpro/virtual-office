export function getAvatarInitial(name) {
  if (!name || typeof name !== 'string') return 'U';
  return name.trim().charAt(0).toUpperCase();
}

export function getAvatarBgColor(name) {
  const colorClasses = [
    'bg-[#b91c1c] ring-[#b91c1c]/30',
    'bg-blue-600 ring-blue-600/30',
    'bg-emerald-600 ring-emerald-600/30',
    'bg-violet-600 ring-violet-600/30',
    'bg-amber-600 ring-amber-600/30',
    'bg-rose-600 ring-rose-600/30',
    'bg-indigo-600 ring-indigo-600/30',
    'bg-teal-600 ring-teal-600/30',
  ];
  if (!name) return colorClasses[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorClasses[Math.abs(hash) % colorClasses.length];
}
