export default function RecentLevelups() {
  // Mock data - replace with real API data later
  const recentUsers = [
    { name: "StudyMaster", level: 25 },
    { name: "QuizKing", level: 24 },
    { name: "LearningLion", level: 23 },
    { name: "BrainBoss", level: 22 },
    { name: "KnowledgeKnight", level: 21 },
    { name: "Scholar Supreme", level: 20 },
    { name: "Genius Girl", level: 19 },
    { name: "Professor Pro", level: 18 },
    { name: "Quiz Wizard", level: 17 },
    { name: "Study Sidekick", level: 16 },
  ];

  // Duplicate the list enough times to ensure seamless infinite scrolling
  const duplicatedUsers = Array(20)
    .fill(null)
    .flatMap(() => recentUsers);

  return (
    <section className="levelups-section">
      <div className="levelups-scroll">
        {duplicatedUsers.map((user, index) => (
          <div key={index} className="levelup-card">
            <div className="levelup-name">{user.name}</div>
            <div className="levelup-level">Level {user.level}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
