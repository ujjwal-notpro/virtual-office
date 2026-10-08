import MeetingsDashboard from '../../../components/meetings/MeetingsDashboard';

export default function MeetingsSection({ userProfile, onNavigateToProfile }) {
  return (
    <MeetingsDashboard
      userProfile={userProfile}
      onNavigateToProfile={onNavigateToProfile}
    />
  );
}
