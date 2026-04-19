// Recent Levelups Component - Scrolling bar showing recent leaderboard entries
import { useEffect, useState } from 'react';

interface LeaderboardUser {
  username: string;
  xp: number;
  level: number;
}

export default function RecentLevelups() {
  // Store leaderboard data
  const [recentUsers, setRecentUsers] = useState<LeaderboardUser[]>([]);

  // Fetch leaderboard on mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/leaderboard');
        const data = await response.json();
        setRecentUsers(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  const defaultUsers = [
    { username: 'Top Learner', xp: 0, level: 1 },
    { username: 'Study Star', xp: 0, level: 1 },
    { username: 'Knowledge King', xp: 0, level: 1 },
    { username: 'Quiz Champion', xp: 0, level: 1 },
    { username: 'Brainiac', xp: 0, level: 1 },
  ];

  const usersToShow = recentUsers.length > 0 ? recentUsers : defaultUsers;
  const items = Array.from({ length: 4 }, () => usersToShow).flat();

  return (
    <section className="levelups-section">
      <div className="levelups-scroll">
        {items.map((user, index) => (
          <div key={`${user.username}-${index}`} className="levelup-card">
            <div className="levelup-name">{user.username}</div>
            <div className="levelup-level">Level {user.level}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
 