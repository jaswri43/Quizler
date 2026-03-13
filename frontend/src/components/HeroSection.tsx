import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

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
    <section className="hero-section">
      <div className="hero-content">
        {profile ? (
          <>
            <h1>Welcome back, {profile.username}!</h1>
            <p>Level {profile.level} — {profile.xp} XP — 🔥 {profile.streak} day streak</p>
          </>
        ) : (
          <>
            <h1>Welcome to Quizler</h1>
            <p>Level up your knowledge and climb the leaderboard</p>
          </>
        )}
        <div className="cta-buttons">
          <button className="cta-button primary">Start Quiz</button>
          <button className="cta-button secondary" onClick={() => navigate('/decks')}>Browse Decks</button>
        </div>
      </div>
    </section>
  );
}