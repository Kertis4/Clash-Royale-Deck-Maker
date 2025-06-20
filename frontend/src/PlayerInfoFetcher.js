import React, { useState } from 'react';
import './index.css';

function PlayerInfoFetcher() {
  const [tag, setTag] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [clanName, setClanName] = useState('');
  const [clanBadgeUrl, setClanBadgeUrl] = useState('');
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

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
        setError(null);
      } else {
        setError(data.error || 'Unknown error');
        setPlayerName('');
        setClanName('');
        setClanBadgeUrl('');
        setCards([]);
      }
    } catch (err) {
      setError(err.message);
      setPlayerName('');
      setClanName('');
      setClanBadgeUrl('');
      setCards([]);
    }
  };

  return (
    <div className="container">
      <div className="content-box">
        <h1>Clash Royale Player Info</h1>

        <div className="input-section">
          <input
            type="text"
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="Enter Player Tag"
          />
          <button onClick={fetchPlayerInfo}>Fetch Info</button>
        </div>

        {error && <p className="error">{error}</p>}

        {playerName && (
          <div className="player-info">
            <h2>{playerName}</h2>
            <div className="clan-info">
              {clanBadgeUrl && <img src={clanBadgeUrl} alt="Clan Badge" />}
              <p>{clanName}</p>
            </div>
          </div>
        )}

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
    </div>
  );
}

export default PlayerInfoFetcher;
