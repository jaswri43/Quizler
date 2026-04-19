// Social Page - User leaderboard and rankings
import { useState, useEffect } from 'react';

export default function SocialPage() {
  // Leaderboard data from API
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await fetch('http://127.0.0.1:5000/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <section className="hero-section">
      <div style={{ width: '90%', maxWidth: '900px', textAlign: 'center' }}>
        <h1>Leaderboard</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {leaderboard.map((user, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', background: 'rgba(0,168,232,0.15)', border: '1px solid #00A8E8', borderRadius: '8px', padding: '1rem 2rem', width: '100%', boxSizing: 'border-box' as 'border-box' }}>
              <span style={{ color: '#FF6600', fontWeight: 700, fontSize: '1.2rem', minWidth: '60px' }}>#{index + 1}</span>
              <span style={{ color: '#fff', fontWeight: 600, flex: 1, textAlign: 'center' }}>{user.username}</span>
              <span style={{ color: '#FF6600', textAlign: 'right' }}>Level {user.level} — {user.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}