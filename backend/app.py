from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

headers = {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImYyZDZmZDZkLTQ1NDItNDQ0Yy05NzQyLTMyNDY5MTQ0MzlkNiIsImlhdCI6MTc1MDAwNTUyMiwic3ViIjoiZGV2ZWxvcGVyL2MyYWIyMDI4LTY2YTUtNDI3NS0zNGVlLTE3YjVjNjUyZTJmMSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI1MS4xNzEuNzcuMTc2Il0sInR5cGUiOiJjbGllbnQifV19.k6jSHEGlrLhf4Echq8zyaMg0JHZHCTlPFCCxMNPTwrrxIeKX7bEx-pgFRaDcktJowhgRokmpsR-hl_3041qvAQ"
}

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
            game_level = convert_level(card)  # <-- HERE you calculate it correctly
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

if __name__ ***REMOVED*** '__main__':
    app.run(debug=True)