import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection.tsx';
import RecentLevelups from '../components/RecentLevelups.tsx';

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return;

    const fetchProfile = async () => {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${user_id}`);
      const data = await response.json();
      setProfile(data.data);
    };
    fetchProfile();
  }, []);

  return (
    <>
      <HeroSection />
      {profile && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#fff' }}>
          <h2>Welcome back, {profile.username}!</h2>
          <p>Level {profile.level} — {profile.xp} XP — 🔥 {profile.streak} day streak</p>
        </div>
      )}
      <RecentLevelups />
    </>
  );
}