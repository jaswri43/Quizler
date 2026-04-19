import { useState, useEffect } from 'react';

export default function DecksPage() {
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [assignedDecks, setAssignedDecks] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('student');
  const [justAssignedId, setJustAssignedId] = useState<string | number | null>(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      window.location.href = '/login';
      return;
    }
    fetchDecks();
    fetchAssignedDecks();

    const fetchRole = async () => {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${user_id}`);
      const data = await response.json();
      if (data.data && data.data.role) {
        setUserRole(data.data.role);
      }
    };
    fetchRole();
  }, []);

  const fetchDecks = async () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return;

    const response = await fetch(`http://127.0.0.1:5000/api/decks?user_id=${user_id}`);
    const data = await response.json();
    setDecks(data.data);
  };

  const fetchAssignedDecks = async () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) return;

    const response = await fetch(`http://127.0.0.1:5000/api/assigned-decks/${user_id}`);
    const data = await response.json();
    if (data.data) {
      setAssignedDecks(data.data);
    }
  };

  const fetchCards = async (deck_id: string) => {
    const response = await fetch(`http://127.0.0.1:5000/api/cards/${deck_id}`);
    const data = await response.json();
    setCards(data.data);
  };

  const createDeck = async () => {
    if (!newDeckTitle) return;
    await fetch('http://127.0.0.1:5000/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newDeckTitle, user_id: localStorage.getItem('user_id') })
    });
    setNewDeckTitle('');
    fetchDecks();
  };

  const deleteDeck = async (deck_id: string) => {
    await fetch(`http://127.0.0.1:5000/api/decks/${deck_id}`, { method: 'DELETE' });
    setSelectedDeck(null);
    setCards([]);
    fetchDecks();
  };

  const assignDeck = async (deck_id: string) => {
    const response = await fetch('http://127.0.0.1:5000/api/assign-deck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deck_id })
    });

    const data = await response.json();
    if (response.ok) {
      setJustAssignedId(deck_id);

      setTimeout(() => {
        setJustAssignedId(null);
        fetchAssignedDecks();
      }, 1000);

    } else {
      alert("Error: " + data.error);
    }
  };

  const unassignDeck = async (deck_id: string) => {
    if (!window.confirm("Are you sure you want to unassign this deck? It will move back to 'Your Decks'.")) return;

    const response = await fetch(`http://127.0.0.1:5000/api/unassign-deck/${deck_id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      fetchAssignedDecks();
      fetchDecks();
    } else {
      alert("Failed to unassign deck.");
    }
  };

  const startEditing = (card: any) => {
    setEditingCardId(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
  };



  const saveEdit = async (card_id: number) => {
    if (!editFront || !editBack) return;
    await fetch(`http://127.0.0.1:5000/api/cards/${card_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ front: editFront, back: editBack })
    });
    setEditingCardId(null);
    fetchCards(selectedDeck.id);
  };

  const addCard = async () => {
    if (!newCardFront || !newCardBack || !selectedDeck) return;
    await fetch('http://127.0.0.1:5000/api/add-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ front: newCardFront, back: newCardBack, deck_id: selectedDeck.id })
    });
    setNewCardFront('');
    setNewCardBack('');
    fetchCards(selectedDeck.id);
  };

  const deleteCard = async (card_id: number) => {
    await fetch(`http://127.0.0.1:5000/api/cards/${card_id}`, { method: 'DELETE' });
    fetchCards(selectedDeck.id);
  };

  return (
    <section className="hero-section">
      <div className="hero-content" style={{ maxWidth: '800px', width: '100%' }}>
        {!selectedDeck ? (
          <>
            <h1>Your Decks</h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
              <input
                type="text"
                placeholder="New deck title"
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem', flex: 1 }}
              />
              <button className="cta-button primary" onClick={createDeck}>Create Deck</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {decks.filter(deck => !assignedDecks.some(assigned => assigned.id === deck.id)).map((deck) => (
                  <div key={deck.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,168,232,0.15)', border: '1px solid #00A8E8', borderRadius: '8px', padding: '1rem 1.5rem' }}>
      <span style={{ color: '#fff', fontWeight: 600, flex: 1, marginRight: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {deck.title}
      </span>

                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      {/* 1. Open Button */}
                      <button className="cta-button primary" onClick={() => { setSelectedDeck(deck); fetchCards(deck.id); }}>Open</button>

                      {/* 2. Assign Button (Only for Teachers) */}
                      {userRole === 'teacher' && (
                          <button
                              className="cta-button primary"
                              style={{
                                backgroundColor: justAssignedId === deck.id ? '#28a745' : '#FF6600',
                                borderColor: justAssignedId === deck.id ? '#28a745' : '#FF6600',
                                transition: 'all 0.3s ease'
                              }}
                              onClick={() => assignDeck(deck.id)}
                              disabled={justAssignedId === deck.id}
                          >
                            {justAssignedId === deck.id ? '✓ Done' : 'Assign'}
                          </button>
                      )}

                      {/* 3. Delete Button */}
                      <button className="cta-button secondary" onClick={() => deleteDeck(deck.id)}>Delete</button>
                    </div>
                  </div>
              ))}
            </div>


          <hr style={{ border: '0', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '3rem 0' }} />
      <h1 style={{ marginTop: '0' }}>Assigned Decks</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {assignedDecks.length === 0 ? (
            <p style={{ color: '#ccc', textAlign: 'center' }}>You have no assigned decks right now.</p>
        ) : (
            assignedDecks.map((deck) => (
                <div key={deck.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 102, 0, 0.1)',
                  border: '1px solid #FF6600',
                  borderRadius: '8px',
                  padding: '1rem 1.5rem'
                }}>
                  <span style={{ color: '#fff', fontWeight: 600, flex: 1, marginRight: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {deck.title} <span style={{ fontSize: '0.85rem', color: '#FF6600', marginLeft: '0.5rem' }}>(Assigned)</span>
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button className="cta-button primary" onClick={() => { setSelectedDeck(deck); fetchCards(deck.id); }}>Open</button>
                      {userRole === 'teacher' && (
                          <button
                              className="cta-button secondary"
                              style={{ backgroundColor: 'transparent', border: '1px solid #FF6600', color: '#FF6600' }}
                              onClick={() => unassignDeck(deck.id)}
                          >
                            Unassign
                          </button>
                      )}
                    </div>
                </div>
            ))
        )}
      </div>
    </>
        ) : (
          <>
            <button className="cta-button secondary" onClick={() => { setSelectedDeck(null); setCards([]); setEditingCardId(null); }} style={{ marginBottom: '1rem' }}>← Back to Decks</button>
            <h1>{selectedDeck.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Front"
                value={newCardFront}
                onChange={(e) => setNewCardFront(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem', flex: 1 }}
              />
              <input
                type="text"
                placeholder="Back"
                value={newCardBack}
                onChange={(e) => setNewCardBack(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', fontSize: '1rem', flex: 1 }}
              />
              <button className="cta-button primary" onClick={addCard}>Add Card</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cards.map((card) => (
                  <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,168,232,0.15)', border: '1px solid #00A8E8', borderRadius: '8px', padding: '1rem 1.5rem' }}>

                    {editingCardId === card.id ? (
                        <div style={{ display: 'flex', gap: '1rem', flex: 1, marginRight: '1rem' }}>
                          <input
                              type="text"
                              value={editFront}
                              onChange={(e) => setEditFront(e.target.value)}
                              style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', flex: 1 }}
                          />
                          <input
                              type="text"
                              value={editBack}
                              onChange={(e) => setEditBack(e.target.value)}
                              style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', flex: 1 }}
                          />
                        </div>
                    ) : (
                        <span style={{ color: '#fff' }}><strong>{card.front}</strong> — {card.back}</span>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {editingCardId === card.id ? (
                          <>
                            <button className="cta-button primary" onClick={() => saveEdit(card.id)}>Save</button>
                            <button className="cta-button secondary" onClick={() => setEditingCardId(null)}>Cancel</button>
                          </>
                      ) : (
                          <>
                            <button className="cta-button primary" onClick={() => startEditing(card)}>Edit</button>
                            <button className="cta-button secondary" onClick={() => deleteCard(card.id)}>Delete</button>
                          </>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
