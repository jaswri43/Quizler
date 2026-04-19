import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const StreakBonusTracker = ({ currentStreak }: { currentStreak: number }) => {
  const progress = currentStreak % 5 === 0 && currentStreak > 0 ? 5 : currentStreak % 5;
  const daysLeft = 5 - progress;

  return (
      <div style={{
        marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem 2rem',
        background: 'rgba(0, 168, 232, 0.1)', border: '1px solid rgba(255, 102, 0, 0.3)',
        borderRadius: '12px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '450px',
        boxSizing: 'border-box', margin: '2rem auto 0 auto',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>🔥 5-Day Streak Bonus</h3>
          <p style={{ color: '#ccc', fontSize: '0.95rem', margin: 0 }}>
            {daysLeft === 0
                ? "Bonus unlocked! Come back tomorrow to start a new streak!"
                : `Log in ${daysLeft} more day${daysLeft > 1 ? 's' : ''} in a row for a +500 XP boost!`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map((day) => {
            const isCompleted = day <= progress;
            return (
                <div key={day} style={{
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isCompleted ? '#FF6600' : 'rgba(255, 255, 255, 0.05)',
                  color: isCompleted ? '#fff' : '#666', fontWeight: 'bold',
                  boxShadow: isCompleted ? '0 0 12px rgba(255, 102, 0, 0.6)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {isCompleted ? '✓' : day}
                </div>
            );
          })}
        </div>
      </div>
  );
};

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
          <button className="cta-button primary" onClick={() => navigate('/games')}>Start Quiz</button>
          <button className="cta-button secondary" onClick={() => navigate('/decks')}>Browse Decks</button>
        </div>
        {profile && <StreakBonusTracker currentStreak={profile.streak} />}
      </div>
    </section>
  );
}
