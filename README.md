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
  - `/api/dashboardinfo` [POST]: Used to populate the users Dashboard, uses the email the user signs in with to query the DB for their player tag. It gets the players name, last used deck, a record of their last 4 games, their most used card, and the card that beats them the most (This is done by iterating over the battle log, see `app.py` if you want to see it in more detail)

- **`user.py`**
  - Defines a `User` class as a model that encapsulates user-related data and behavior. Each instance represents a user record, with attributes like `username`, `email`, and `player_tag`, and methods for registration and password verification using secure hashing.
  - It also initializes the DB used for both user info, and card stats for the deckbuilder.

- **`deckBuilder.py`**  
  Contains the `build_deck(cards)` function which implements the recommender logic: scoring cards by their meta usage and win rates and selecting the top scoring cards the player owns, turns them into a deck usign `np.random.choice(len(cards), size=8, replace=False, p=probs)`.

- **`metaCrawler.py`**
  Script responsible for scraping public Clash Royale deck data, calculating usage and win rates for cards across many decks, and updating the data base with the stats, used by the backend recommender system.

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

- Improve deck generation with advanced algorithms considering card synergies, elixir cost averages.

- Create individual account features (Save Decks and maybe others)

- Cookie based Auth (prevent CSRF attacks)

- Improve web Security before hosting

- Add caching of dashboard info in the db, as there is a little Delay with the api requests so it could display that and then change if it needs to for a less janky experience.

- Add a save deck feature, (already has a space in the dashboard, need to add a button to save decks, and implement it in the backend)

## Hosting the Site

- I just got a raspberry PI I have NGINIX set up aswell as Ubuntu Server, I just need to make this site more secure, (Cookie Based Auth) and things like that.

- I also plan on getting a domain in the coming days, once I am off work (the weekend) I will hopefully be able to get it up

## Contact

Feel free to open issues or pull requests for questions or contributions.

