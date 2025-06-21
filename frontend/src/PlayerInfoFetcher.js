import React, { useState } from 'react';
import './index.css';

function PlayerInfoFetcher() {
  const [tag, setTag] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [clanName, setClanName] = useState('');
  const [clanBadgeUrl, setClanBadgeUrl] = useState('');
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [error, setError] = useState(null);
  const averageElixir = deck.length > 0
  ? (deck.reduce((sum, card) => sum + (card.elixirCost ?? 0), 0) / deck.length).toFixed(2)
  : null;

  const fetchPlayerInfo = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/playerinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      });
      const data = await res.json();

      if (res.ok) {
        setPlayerName(data.name);
        setClanName(data.clan);
        setClanBadgeUrl(data.badgeUrls?.medium || '');
        setCards(data.cards);
        setDeck([]);
        setError(null);
      } else {
        setError(data.error || 'Unknown error');
        setPlayerName('');
        setClanName('');
        setClanBadgeUrl('');
        setCards([]);
        setDeck([]);
      }
    } catch (err) {
      setError(err.message);
      setPlayerName('');
      setClanName('');
      setClanBadgeUrl('');
      setCards([]);
      setDeck([]);
    }
  };

  const buildDeck = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/builddeck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards }),
      });
      const data = await res.json();

      if (res.ok) {
        setDeck(data.deck);
      } else {
        setError(data.error || 'Error building deck');
      }
    } catch (err) {
      setError(err.message);
    }
  };

return (
  <div className="container">
    <div className="content-box">
      <h1>Make a Clash Royale Deck</h1>

      <div className="input-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
  <div className="brutalist-container" style={{ margin: 0 }}>
    <input
      type="text"
      value={tag}
      onChange={e => setTag(e.target.value)}
      placeholder="e.g 208Q29LCU0"
      className="brutalist-input smooth-type"
      autoComplete="off"
    />
    <label className="brutalist-label">Enter your tag</label>
  </div>
  <button onClick={fetchPlayerInfo}>Fetch Info</button>
</div>

      {error && <p className="error">{error}</p>}

      {playerName && (
        <>
          <div className="player-info">
            <h2>{playerName}</h2>
            <div className="clan-info">
              {clanBadgeUrl && <img src={clanBadgeUrl} alt="Clan Badge" />}
              <p>{clanName}</p>
            </div>
          </div>

          <div className="build-deck-section" id="generate-button" style={{ marginBottom: '1rem' }}>
            <button onClick={buildDeck}>Build Deck</button>
          </div>

         
          {deck.length > 0 && (
            <div className="deck-display" style={{ marginBottom: '1rem' }}>
              <h3>Generated Deck:</h3>
              <p>Average Elixir Cost: {averageElixir}</p>
              <div className="cards-grid">
                {deck.map((card, idx) => (
                  <div className="card" key={idx}>
                    <img src={card.iconUrl} alt={card.name} />
                    <p className="card-name">{card.name}</p>
                    <p className="card-elixir">Elixir: {card.elixirCost ?? 'N/A'}</p>
                    <p className="card-level">Level: {card.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="owned-cards-section" id="owned-cards">
            <h1>Owned Cards</h1>
            <div className="cards-grid">
              {cards.map((card, idx) => (
                <div className="card" key={idx}>
                  <img src={card.iconUrl} alt={card.name} />
                  <p className="card-name">{card.name}</p>
                  <p>Elixir: {card.elixirCost ?? 'N/A'}</p>
                  <p>Level: {card.level}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);}

export default PlayerInfoFetcher
