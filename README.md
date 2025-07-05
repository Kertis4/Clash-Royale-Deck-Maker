# Clash Royale Deck Builder API

This project provides a backend API for fetching Clash Royale player data and generating Clash Royale decks based on the player's owned cards. It supports a React frontend styled with a brutalist design aesthetic.

## Features

- **Player Info Fetching**  
  Retrieves player details from the official Clash Royale API using a player tag. This includes player name, clan information, and detailed owned cards with elixir cost, adjusted card level, rarity, and icon URLs.

- **Deck Building Endpoint**  
  Generates a deck of 8 cards from the player's owned cards. Deck generation is powered by a recommender system that ranks cards based on their meta performance and player usage to produce smarter decks.

- **Authentication**
  Users can register and sign in it just does not do anything ATM, but the system is in place
  
- **CORS Enabled**  
  Allows cross-origin requests so that the frontend and backend can communicate seamlessly.

## Backend Structure

- **`app.py`**  
  Main Flask app defining API routes:
  - `/api/playerinfo` [POST]: Accepts `{ tag: string }`, fetches player data from the Clash Royale API, processes it, and returns player info with cards.
  - `/api/builddeck` [POST]: Accepts `{ cards: array }`, returns a generated deck of 8 cards (currently random).
  - `/api/register` [POST]: Allows users to register with an email, password and player tag. Player tag is checked on the royale API, and the database is queried for duplicate users before creating it.
  - `/api/login` [POST]: Allows the user to log into their account using their email and password.

- **`user.py`**
  Defines a `User` class as a model that encapsulates user-related data and behavior. Each instance represents a user record, with attributes like `username`, `email`, and `player_tag`, and methods for registration and password verification using secure hashing.

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

- Create individual account features (dashboard, Save Decks and maybe others)

- Change meta.json to a database for scalability

- Host the site (getting a raspberry pi in 3 days as of the commit so I will try and self host with that)

## Contact

Feel free to open issues or pull requests for questions or contributions.

