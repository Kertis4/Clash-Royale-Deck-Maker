from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from backend.deckBuilder import build_deck
load_dotenv()

CLASH_API_TOKEN = os.getenv("CLASH_API_TOKEN")

headers = {
    "Authorization": f"Bearer {CLASH_API_TOKEN}"
}


app = Flask(__name__)
CORS(app)

# Conversion function
def convert_level(card):
    level = card.get('level')
    maxLevel = card.get('maxLevel')
    game_level = level + (15 - maxLevel - 1)
    return game_level

@app.route('/api/playerinfo', methods=['POST'])
def get_player_info():
    try:
        data = request.get_json()
        player_tag = data.get('tag')
        if not player_tag:
            return jsonify({'error': 'Player tag is required'}), 400

        formatted_tag = f"%23{player_tag.upper().replace('#', '')}"
        url = f"https://api.clashroyale.com/v1/players/{formatted_tag}"

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return jsonify({'error': 'API request failed', 'details': response.json()}), response.status_code

        player_data = response.json()
        name = player_data.get("name", "Unknown")
        clan = player_data.get("clan", {})
        clan_name = clan.get("name", "No Clan")
        clan_tag = clan.get("tag")
        clan_badge_url = clan.get("badgeUrls", {}).get("medium") or "https://tse3.mm.bing.net/th?id=OIP.LpHJ8QnIHLmQmxk-PabQkAHaD4&pid=Api&P=0&h=180"
        print(clan_tag)

        cards = []
        for card in player_data.get("cards", []):
            game_level = convert_level(card)  
            cards.append({
                'name': card['name'],
                'id': card['id'],
                'level': game_level,
                'elixirCost': card.get('elixirCost'),
                'rarity': card.get('rarity'),
                'iconUrl': card['iconUrls']['medium']
            })

        response_json = {
            'name': name,
            'clan': clan_name,
            'badgeUrls': clan_badge_url,
            'cards': cards
        }

        return jsonify(response_json)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/builddeck', methods=['POST'])
def build_deck_route():
    try:
        data = request.get_json()
        cards = data.get('cards')
        if not cards or len(cards) < 8:
            return jsonify({'error': 'Not enough cards provided'}), 400

        deck = build_deck(cards)
        return jsonify({'deck': deck})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#if __name__ == '__main__':
 #   app.run(debug=False)