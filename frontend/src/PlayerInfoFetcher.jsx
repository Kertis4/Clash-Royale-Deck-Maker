import React, { useState } from 'react';

function PlayerInfoFetcher() {
  const [tag, setTag] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [clanName, setClanName] = useState('');
  const [clanBadgeUrl, setClanBadgeUrl] = useState('');
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [error, setError] = useState(null);

  const averageElixir =
    deck.length > 0
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
        setError(null);
      } else {
        setError(data.error || 'Error building deck');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center items-start py-12 px-6">
      <div className="max-w-5xl w-full bg-gray-800 bg-opacity-90 rounded-xl border border-gray-700 shadow-lg p-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-yellow-400 mb-8">Make a Clash Royale Deck</h1>

        <div className="flex flex-wrap gap-4 mb-8 items-center justify-start">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter your tag e.g. 208Q29LCU0"
            className="rounded-md border border-yellow-400 bg-gray-900 px-4 py-2 placeholder-yellow-300 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 w-64"
            autoComplete="off"
          />
          <button
            onClick={fetchPlayerInfo}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-md shadow-md transition"
          >
            Fetch Info
          </button>
        </div>

        {error && <p className="text-red-500 font-semibold mb-6">{error}</p>}

        {playerName && (
          <>
            <div className="player-info mb-8">
              <h2 className="text-3xl font-bold text-yellow-400">{playerName}</h2>
              <div className="clan-info flex items-center gap-4 mt-2">
                {clanBadgeUrl && (
                  <img
                    src={clanBadgeUrl}
                    alt="Clan Badge"
                    className="w-12 h-12 rounded-full border-2 border-yellow-400"
                  />
                )}
                <p className="text-yellow-300 font-semibold">{clanName}</p>
              </div>
            </div>

            <div className="build-deck-section mb-8">
              <button
                onClick={buildDeck}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-md shadow-md transition w-full max-w-xs"
              >
                Build Deck
              </button>
            </div>

            {deck.length > 0 && (
              <div className="deck-display mb-8">
                <h3 className="text-2xl font-semibold mb-2 text-yellow-400">Generated Deck</h3>
                <p className="mb-4 font-medium text-yellow-300">Average Elixir Cost: {averageElixir}</p>
                <div className="grid grid-cols-4 grid-rows-2 gap-4 justify-center">
                  {deck.map((card, idx) => (
                    <div
                      className="card flex flex-col items-center bg-gray-900 bg-opacity-70 border border-yellow-400 rounded-lg p-2 shadow-md"
                      key={idx}
                    >
                      <img
                        src={card.iconUrl}
                        alt={card.name}
                        className="w-[100px] h-[125px] object-contain mb-2"
                      />
                      <p className="card-name text-yellow-400 font-semibold text-center">{card.name}</p>
                      <p className="card-elixir text-yellow-300 font-medium">Elixir: {card.elixirCost ?? 'N/A'}</p>
                      <p className="card-level text-yellow-300 font-medium">Level: {card.level}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
              
            <div className="owned-cards-section">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Owned Cards</h2>
              <div className="grid grid-cols-6 gap-4 max-w-full overflow-x-auto">
                {cards.map((card, idx) => (
                  <div
                    className="card flex flex-col items-center bg-gray-900 bg-opacity-70 border border-yellow-400 rounded-lg p-2 shadow-md min-w-[110px]"
                    key={idx}
                  >
                    <img
                      src={card.iconUrl}
                      alt={card.name}
                      className="w-[100px] h-[125px] object-contain mb-2"
                    />
                    <p className="card-name text-yellow-400 font-semibold text-center">{card.name}</p>
                    <p className="text-yellow-300 font-medium">Elixir: {card.elixirCost ?? 'N/A'}</p>
                    <p className="text-yellow-300 font-medium">Level: {card.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerInfoFetcher;
