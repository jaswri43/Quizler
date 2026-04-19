import { useState, useEffect } from 'react';

export default function StudyPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [loadingCards, setLoadingCards] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      window.location.href = '/login';
      return;
    }
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setError(null);
      const user_id = localStorage.getItem('user_id');
      const url = user_id
        ? `http://127.0.0.1:5000/api/decks?user_id=${user_id}`
        : 'http://127.0.0.1:5000/api/decks';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Deck fetch failed: ${response.status}`);
      }
      const data = await response.json();
      setDecks(Array.isArray(data.data) ? data.data : []);
    } catch (fetchError) {
      console.error('Error fetching decks:', fetchError);
      setError('Unable to load decks. Please refresh the page.');
    }
  };

  const startGame = async (deck: any) => {
    try {
      setError(null);
      setLoadingCards(true);
      const response = await fetch(`http://127.0.0.1:5000/api/cards/${deck.id}`);
      if (!response.ok) {
        throw new Error(`Card fetch failed: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data.data)) {
        throw new Error('Unexpected card response');
      }
      setSelectedDeck(deck);
      setCards(data.data);
      setCurrentIndex(0);
      setFlipped(false);
      setFinished(false);
      if (data.data.length === 0) {
        setError('This deck has no cards yet.');
      }
    } catch (fetchError) {
      console.error('Error fetching cards:', fetchError);
      setError('Unable to load flashcards for this deck.');
      setSelectedDeck(deck);
      setCards([]);
      setCurrentIndex(0);
      setFlipped(false);
      setFinished(false);
    } finally {
      setLoadingCards(false);
    }
  };

  const nextCard = () => {
    if (currentIndex + 1 >= cards.length) {
      finishGame();
    } else {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const finishGame = async () => {
    const user_id = localStorage.getItem('user_id');
    const xp = cards.length * 10;
    await fetch(`http://127.0.0.1:5000/api/users/${user_id}/xp`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp_gained: xp })
    });
    setXpGained(xp);
    setFinished(true);
  };

  return (
    <section className="hero-section">
      <div className="hero-content" style={{ maxWidth: '700px', width: '100%' }}>

        {/* Deck selection screen */}
        {!selectedDeck && (
          <>
            <h1>Study Mode</h1>
            <p>Pick a deck to study</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {decks.map((deck) => (
                <div key={deck.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', background: 'rgba(0,168,232,0.15)', border: '1px solid #00A8E8', borderRadius: '8px', padding: '1rem 1.5rem' }}>
                  <span style={{ color: '#fff', fontWeight: 600, flex: 1, minWidth: 0 }}>{deck.title}</span>
                  <button className="cta-button primary" onClick={() => startGame(deck)} style={{ flexShrink: 0 }}>Study</button>
                </div>
              ))}
            </div>
          </>
        )}

        {error && !selectedDeck && (
          <p style={{ color: '#FFBABA', marginBottom: '1rem' }}>{error}</p>
        )}

        {/* Finished screen */}
        {selectedDeck && finished && (
          <>
            <h1>🎉 Nice Work!</h1>
            <p>You studied all {cards.length} cards in <strong>{selectedDeck.title}</strong></p>
            <p style={{ color: '#FF6600', fontSize: '1.5rem', fontWeight: 700 }}>+{xpGained} XP earned!</p>
            <div className="cta-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="cta-button primary" onClick={() => startGame(selectedDeck)}>Study Again</button>
              <button className="cta-button secondary" onClick={() => { setSelectedDeck(null); setFinished(false); }}>Back to Decks</button>
            </div>
          </>
        )}

        {selectedDeck && !finished && cards.length === 0 && (
          <>
            <h1>{selectedDeck.title}</h1>
            <p style={{ color: '#fff', marginTop: '1rem' }}>{loadingCards ? 'Loading cards…' : (error ?? 'No cards were found for this deck.')}</p>
            <div className="cta-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="cta-button secondary" onClick={() => setSelectedDeck(null)}>Back to Decks</button>
            </div>
          </>
        )}

        {/* Card study screen */}
        {selectedDeck && !finished && cards.length > 0 && (
          <>
            <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>Card {currentIndex + 1} of {cards.length} — {selectedDeck.title}</p>
            <div
              onClick={() => setFlipped(!flipped)}
              style={{ background: flipped ? 'rgba(255,102,0,0.15)' : 'rgba(0,168,232,0.15)', border: flipped ? '1px solid #FF6600' : '1px solid #00A8E8', borderRadius: '12px', padding: '3rem 2rem', cursor: 'pointer', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'all 0.3s ease' }}
            >
              <p style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                {flipped ? cards[currentIndex].back : cards[currentIndex].front}
              </p>
            </div>
            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {flipped ? 'Showing answer' : 'Click card to reveal answer'}
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={nextCard}>
                {currentIndex + 1 >= cards.length ? 'Finish' : 'Next Card'}
              </button>
              <button className="cta-button secondary" onClick={() => { setSelectedDeck(null); }}>Quit</button>
            </div>
          </>
        )}

      </div>
    </section>
  );
}