from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from deckBuilder import build_deck
from user import db, User
from flask_sqlalchemy import SQLAlchemy
from collections import Counter

load_dotenv()

CLASH_API_TOKEN = os.getenv("CLASH_API_TOKEN")

headers = {
    "Authorization": f"Bearer {CLASH_API_TOKEN}"
}


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


with app.app_context():
    db.create_all()

# Conversion function
def convert_level(card):
    level = card.get('level')
    maxLevel = card.get('maxLevel')
    game_level = level + (15 - maxLevel - 1)
    return game_level

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    tag = data.get('tag')

    if not email or not password or not tag:
        return jsonify({'error': 'Missing fields'}), 400

    formatted_tag = tag.upper().replace("#", "")
    full_tag = f"%23{formatted_tag}"

    # Check Clash API for valid player tag
    url = f"https://api.clashroyale.com/v1/players/{full_tag}"
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return jsonify({'error': 'Invalid Clash Royale tag'}), 400

    cr_data = response.json()
    username = cr_data.get("name")

    # Check if email or tag already exists
    if User.query.filter((User.email == email) | (User.player_tag == formatted_tag)).first():
        return jsonify({'error': 'Account already exists'}), 400

    new_user = User.register(email=email, password=password, player_tag=formatted_tag, username=username)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully', 'username': username}), 201


#Login Route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        return jsonify({
            'message': 'Login successful',
            'username': user.username,
            'email': user.email,
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

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
        
        # card info
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
        print(player_data)
        response_json = {
            'name': name,
            'clan': clan_name,
            'badgeUrls': clan_badge_url,
            'cards': cards
        }

        return jsonify(response_json)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    




# formatting the cards functionaly so I can send what the dashboard is actually looking for
def format_card(card):
    if not card:
        return {"name": "Unknown", "iconUrl": None}
    icon_url = None
    if "iconUrls" in card and isinstance(card["iconUrls"], dict):
        icon_url = card["iconUrls"].get("medium")
    elif "iconUrl" in card:
        icon_url = card.get("iconUrl")
    return {
        "name": card.get("name", "Unknown"),
        "iconUrl": icon_url or None
    }


@app.route('/api/dashboardinfo', methods=['POST'])
def get_dashboard_info():
    # Find Player tag by querying the db with their sign in email
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    player_tag = user.player_tag
    formatted_tag = f"%23{player_tag.upper().replace('#', '')}"
    
    # use the tag to retrieve user info
    player_url = f"https://api.clashroyale.com/v1/players/{formatted_tag}"
    player_response = requests.get(player_url, headers=headers)
    if player_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch player info'}), player_response.status_code
    player_data = player_response.json()
    
    name = player_data.get("name", "Unknown")
    clan = player_data.get("clan")
    clan_name = clan.get("name") if clan else "No Clan"
    clan_tag = clan.get("tag") if clan else ""
    badge_urls = clan.get("badgeUrls", {}).get("large") if clan else ""
    
    # Get battle log
    battlelog_url = f"https://api.clashroyale.com/v1/players/{formatted_tag}/battlelog"
    battlelog_response = requests.get(battlelog_url, headers=headers)
    if battlelog_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch battle log'}), battlelog_response.status_code
    battle_log = battlelog_response.json()

    card_counter = Counter()
    opponent_card_counter = Counter()
    last_deck_cards = []

    # Extract most recent deck
    if battle_log:
        most_recent_battle = battle_log[0]
        team = most_recent_battle.get("team", [])
        for player_data in team:
            if player_data.get("tag", "").upper().replace('#', '') == player_tag.upper().replace('#', ''):
                last_deck_cards = player_data.get("cards", [])
                break

    # Analyze all battles
    for battle in battle_log:
        team = battle.get("team", [])
        opponent = battle.get("opponent", [])

        player_crowns = None
        opponent_crowns = None
        player_lost = False

        # Find player and count their cards
        for player in team:
            if player.get("tag", "").upper().replace('#', '') == player_tag.upper().replace('#', ''):
                cards = player.get("cards", [])
                player_crowns = player.get("crowns", 0)
                if cards:
                    last_deck_cards = cards
                    for card in cards:
                        card_name = card.get("name")
                        if card_name:
                            card_counter[card_name] += 1
                break

        # Get opponent crowns
        if opponent:
            opponent_crowns = opponent[0].get("crowns", 0)

        # Determine if player lost
        if player_crowns is not None and opponent_crowns is not None and player_crowns < opponent_crowns:
            for opp in opponent:
                for card in opp.get("cards", []):
                    card_name = card.get("name")
                    if card_name:
                        opponent_card_counter[card_name] += 1

    # Most used card logic
    most_used_card = None
    if card_counter:
        top_card_name, _ = card_counter.most_common(1)[0]
        for battle in battle_log:
            for player in battle.get("team", []):
                if player.get("tag", "").upper().replace('#', '') == player_tag.upper().replace('#', ''):
                    for card in player.get("cards", []):
                        if card.get("name") == top_card_name:
                            most_used_card = card
                            break
                    if most_used_card:
                        break
            if most_used_card:
                break

    # Most countered card logic
    most_countered_card = None
    if opponent_card_counter:
        top_countered_name, _ = opponent_card_counter.most_common(1)[0]
        for battle in battle_log:
            for opp in battle.get("opponent", []):
                for card in opp.get("cards", []):
                    if card.get("name") == top_countered_name:
                        most_countered_card = card
                        break
                if most_countered_card:
                    break
            if most_countered_card:
                break

    # Last 4 match summaries
    last_matches = []
    for battle in battle_log[:4]:
        player_crowns = None
        opponent_crowns = None
        player_found = False

        for team_player in battle.get("team", []):
            if team_player.get("tag", "").upper().replace('#', '') == player_tag.upper().replace('#', ''):
                player_crowns = team_player.get("crowns", 0)
                player_found = True
                break

        opponent = battle.get("opponent", [])
        opponent_crowns = opponent[0].get("crowns", 0) if opponent else 0
        opponent_name = opponent[0].get("name", "Unknown") if opponent else "Unknown"

        if player_found:
            result = "W" if player_crowns > opponent_crowns else "L" if player_crowns < opponent_crowns else "D"
        else:
            result = "N/A"

        last_matches.append({"result": result, "opponent": opponent_name})

    return jsonify({
        "name": name,
        "clanName": clan_name,
        "clanTag": clan_tag,
        "badgeUrls": badge_urls,
        "cards": [
            format_card(most_used_card),
            format_card(most_countered_card),
            *[format_card(c) for c in last_deck_cards]
        ],
        "lastMatches": last_matches
    })




    
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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)