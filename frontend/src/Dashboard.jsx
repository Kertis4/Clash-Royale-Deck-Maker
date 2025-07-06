import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, logout }) {
  const [playerName, setPlayerName] = useState('');
  const [clanName, setClanName] = useState('');
  const [clanTag, setClanTag] = useState('');
  const [clanBadgeUrl, setClanBadgeUrl] = useState('');
  const [mostUsedCard, setMostUsedCard] = useState(null);
  const [mostCounteredCard, setMostCounteredCard] = useState(null);
  const [lastDeck, setLastDeck] = useState([]);
  const [lastMatches, setLastMatches] = useState([]);
  const [savedDecks, setSavedDecks] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email) {
      console.error('No user email found in localStorage');
      return;
    }
    const userEmail = user.email;

    async function fetchPlayerInfo() {
      try {
        const response = await fetch('http://localhost:5000/api/dashboardinfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        });

        let data;

        if (!response.ok) {
          try {
            data = await response.json();
            console.warn('Partial or error response received', data);
          } catch {
            throw new Error(`Failed to fetch player info: ${response.status}`);
          }
        } else {
          data = await response.json();
        }

        setPlayerName(data?.name || 'Unknown Player');
        setClanName(data?.clanName || 'No Clan');
        setClanTag(data?.clanTag || '');
        setClanBadgeUrl(data?.badgeUrls || '');

        if (data?.cards?.length) {
          setMostUsedCard(data.cards[0]);
          setMostCounteredCard(data.cards[1]);
          setLastDeck(data.cards.slice(0, 8));
        } else {
          setMostUsedCard(null);
          setMostCounteredCard(null);
          setLastDeck([]);
        }

        setLastMatches(data?.lastMatches || []);

        setSavedDecks(data?.savedDecks || []);
      } catch (err) {
        console.error('Error fetching player info:', err);
      }
    }

    fetchPlayerInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-yellow-300 p-4 space-y-4 mt-10">
      <Navbar user={user} />

      <div className="flex justify-end mt-4">
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 border border-yellow-500 rounded-xl p-6 mb-8 shadow-md mt-24">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-yellow-400">{playerName}</h2>
            <p className="text-lg text-yellow-300">
              {clanName} <span className="text-sm text-yellow-500">({clanTag})</span>
            </p>
          </div>
          {clanBadgeUrl && (
            <img
              src={clanBadgeUrl}
              alt="Clan Badge"
              className="w-16 h-16 rounded-full border border-yellow-400 mt-4 md:mt-0"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 border border-yellow-500 rounded-xl p-4 shadow-md">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Most Used Card</h3>
            {mostUsedCard && (
              <div className="flex flex-col items-center">
                <img
                  src={mostUsedCard.iconUrl}
                  alt={mostUsedCard.name}
                  className="w-[100px] h-[120px] object-contain"
                />
                <p className="text-lg font-semibold mt-2">{mostUsedCard.name}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 border border-yellow-500 rounded-xl p-4 shadow-md">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Card That Beats You</h3>
            {mostCounteredCard && (
              <div className="flex flex-col items-center">
                <img
                  src={mostCounteredCard.iconUrl}
                  alt={mostCounteredCard.name}
                  className="w-[100px] h-[120px] object-contain"
                />
                <p className="text-lg font-semibold mt-2">{mostCounteredCard.name}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 border border-yellow-500 rounded-xl p-4 shadow-md">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Last Used Deck</h3>
            <div className="grid grid-cols-4 gap-2">
              {lastDeck?.map((card, idx) => (
                <img
                  key={idx}
                  src={card.iconUrl}
                  alt={card.name}
                  className="w-full h-[80px] object-contain rounded-md"
                />
              ))}
            </div>
          </div>

           <div className="bg-gray-800 border border-yellow-500 rounded-xl p-4 shadow-md">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">Last 4 Matches</h3>
      <ul className="space-y-2">
        {lastMatches.map((match, idx) => (
          <li
            key={idx}
            className={`text-lg font-medium ${
              match.result === 'W' ? 'text-green-400' :
              match.result === 'D' ? 'text-yellow-300' :
              match.result === 'L' ? 'text-red-400' : 'text-gray-300'
            }`}
          >
            {match.result} vs {match.opponent}
          </li>
        ))}
      </ul>
    </div>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">Saved Decks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {savedDecks.slice(0, 2).map((deck, idx) => (
              <div key={idx} className="bg-gray-800 border border-yellow-500 rounded-lg p-2">
                <div className="grid grid-cols-4 gap-1">
                  {deck.map((card, i) => (
                    <img
                      key={i}
                      src={card.iconUrl}
                      alt={card.name}
                      className="h-[60px] w-full object-contain rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded hover:bg-yellow-600 transition">
            View More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
