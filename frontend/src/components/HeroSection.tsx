export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Quizzler</h1>
        <p>Level up your knowledge and climb the leaderboard</p>
        <div className="cta-buttons">
          <button className="cta-button primary">Start Quiz</button>
          <button className="cta-button secondary">Create Deck</button>
          <button className="cta-button secondary">Browse Decks</button>
        </div>
      </div>
    </section>
  );
}
