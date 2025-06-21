# Clash Royale Deck Builder API

This project provides a backend API for fetching Clash Royale player data and generating Clash Royale decks based on the player's owned cards. It supports a React frontend styled with a brutalist design aesthetic.

## Features

- **Player Info Fetching**  
  Retrieves player details from the official Clash Royale API using a player tag. This includes player name, clan information, and detailed owned cards with elixir cost, adjusted card level, rarity, and icon URLs.

- **Deck Building Endpoint**  
  Generates a deck of 8 cards from the player's owned cards. Deck generation is powered by a recommender system that ranks cards based on their meta performance and player usage to produce smarter decks.

- **Brutalist Design Frontend**  
  The frontend uses a brutalist UI style with bold inputs, glitch effects, and strong typography for a distinct and engaging user experience.

- **CORS Enabled**  
  Allows cross-origin requests so that the frontend and backend can communicate seamlessly.

## Backend Structure

- **`app.py`**  
  Main Flask app defining API routes:
  - `/api/playerinfo` [POST]: Accepts `{ tag: string }`, fetches player data from the Clash Royale API, processes it, and returns player info with cards.
  - `/api/builddeck` [POST]: Accepts `{ cards: array }`, returns a generated deck of 8 cards (currently random).

- **`deckBuilder.py`**  
  Contains the `build_deck(cards)` function which implements the recommender logic: scoring cards by their meta usage and win rates and selecting the top scoring cards the player owns, turns them into a deck usign `np.random.choice(len(cards), size=8, replace=False, p=probs)`.

- **`metaCrawler.py`**
  Script responsible for scraping public Clash Royale deck data, calculating usage and win rates for cards across many decks, and updating the `meta.json` file used by the backend recommender system.

- **Environment Variables**  
  Requires a `.env` file with the Clash Royale API token set as `CLASH_API_TOKEN`.

## Usage

1. Install dependencies:
```bash
pip install -r requirements.txt
```
2. Create a .env file containing
```ini
CLASH_API_TOKEN=your_api_token_here
```
3. Run the Flask sever
```bash
python app.py
```
4. Use the React frontend to input a player tag, fetch player info, and generate decks.

## Future Improvements

- Improve deck generation with advanced algorithms considering card synergies, elixir cost averages, and dynamic meta shifts.

- Enhance the brutalist frontend with more refined animations and user feedback.

- Add additional API features such as player battle logs, detailed stats, and clan information.

- Introduce machine learning models to further personalize deck recommendations based on player performance data.

## Contact

Feel free to open issues or pull requests for questions or contributions.

