import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

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
        resetData();
      }
    } catch (err) {
      setError(err.message);
      resetData();
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

  const resetData = () => {
    setPlayerName('');
    setClanName('');
    setClanBadgeUrl('');
    setCards([]);
    setDeck([]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-yellow-300 p-4 space-y-4">
      <div className="p-4 space-y-4">
        <Navbar/>
        <div className="flex justify-center mt-10">
         <div className={`bg-gray-800 border border-yellow-500 rounded-xl shadow-lg w-full transition-all duration-300 mt-40
  ${playerName ? 'max-w-5xl p-12' : 'max-w-md p-8'}`}>

            <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Enter Your Player Tag</h2>
            <div className="flex flex-col gap-4 items-center">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. 208Q29LCU0"
                className="rounded-md border border-yellow-400 bg-gray-900 px-4 py-2 placeholder-yellow-300 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                autoComplete="off"
              />
              <button
                onClick={fetchPlayerInfo}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-2 rounded-md shadow-md transition w-full"
              >
                Fetch Info
              </button>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              {playerName && (
                <>
                  {/* Player Info */}
                  <div className="space-y-1 mt-6">
                    <h2 className="text-3xl font-semibold text-yellow-400">{playerName}</h2>
                    <div className="flex items-center gap-2">
                      {clanBadgeUrl && (
                        <img
                          src={clanBadgeUrl}
                          alt="Clan Badge"
                          className="w-10 h-10 rounded-full border border-yellow-400"
                        />
                      )}
                      <p className="text-yellow-300 text-lg">{clanName}</p>
                    </div>
                  </div>

                  {/* Build Deck */}
                  <button
                    onClick={buildDeck}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-md text-lg mt-6"
                  >
                    Build Deck
                  </button>

                  {/* Deck */}
                  {deck.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-yellow-400 mt-8 mb-3">Generated Deck</h3>
                      <p className="text-lg text-yellow-300 mb-4">
                        Average Elixir: {averageElixir}
                      </p>
                      <div className="grid grid-cols-4 gap-4">
                        {deck.map((card, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center border border-yellow-400 rounded-md p-3 text-center"
                          >
                            <img
                              src={card.iconUrl}
                              alt={card.name}
                              className="w-[120px] h-[150px] object-contain"
                            />
                            <p className="text-yellow-400 text-lg font-semibold">{card.name}</p>
                            <p className="text-yellow-300 text-sm">Elixir: {card.elixirCost ?? 'N/A'}</p>
                            <p className="text-yellow-300 text-sm">Level: {card.level}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Owned Cards */}
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400 mt-10 mb-4">Owned Cards</h2>
                    <div className="grid grid-cols-6 gap-4">
                      {cards.map((card, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center border border-yellow-400 rounded-md p-3 text-center"
                        >
                          <img
                            src={card.iconUrl}
                            alt={card.name}
                            className="w-[120px] h-[150px] object-contain"
                          />
                          <p className="text-yellow-400 text-lg font-semibold">{card.name}</p>
                          <p className="text-yellow-300 text-sm">Elixir: {card.elixirCost ?? 'N/A'}</p>
                          <p className="text-yellow-300 text-sm">Level: {card.level}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerInfoFetcher;
