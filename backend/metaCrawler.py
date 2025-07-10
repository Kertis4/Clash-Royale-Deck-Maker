import requests
import os
import time
from collections import defaultdict
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from app import app, db
from user import CardMeta

load_dotenv()
API_TOKEN = os.getenv("CLASH_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}
BASE_URL = "https://api.clashroyale.com/v1"

def api_get(endpoint, params=None, retries=3, sleep_time=1.5):
    url = f"{BASE_URL}{endpoint}"
    for attempt in range(1, retries + 1):
        try:
            response = requests.get(url, headers=HEADERS, params=params, timeout=10)
            print(f"[Attempt {attempt}] {url} - Status Code: {response.status_code}")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"[Retry {attempt}/{retries}] Error: {e}")
            time.sleep(sleep_time)
    print(f"Failed after {retries} retries: {url}")
    return None

def get_leaderboards():
    print("Fetching leaderboards...")
    data = api_get("/leaderboards")
    if not data:
        print("Failed to fetch leaderboards.")
        return []
    
    import json
    print("Raw leaderboards response:")
    print(json.dumps(data, indent=2))
    
    return data  

def get_leaderboard_players(leaderboard_id, limit=100):
    print(f"Fetching players from leaderboard ID: {leaderboard_id}")
    data = api_get(f"/leaderboards/{leaderboard_id}", params={"limit": limit})
    if not data:
        print("Failed to fetch leaderboard players.")
        return []
    
    import json
    print("Raw leaderboard players response:")
    print(json.dumps(data, indent=2))
    
    players = data.get("items", [])
    tags = [player["tag"] for player in players]
    print(f"Fetched {len(tags)} player tags from leaderboard.")
    return tags

def get_top_player_tags(limit=100):
 
    leaderboards = get_leaderboards()
    if not leaderboards:
        print("No leaderboards found.")
        return []
    
    
    global_lb = next((lb for lb in leaderboards if "Global" in lb.get("name", "")), None)
    if not global_lb:
        
        global_lb = leaderboards[0]
    
    print(f"Using leaderboard: {global_lb.get('name')} (ID: {global_lb.get('id')})")
    return get_leaderboard_players(global_lb["id"], limit=limit)

def get_battle_log(player_tag, retries=3):
    encoded_tag = player_tag.replace("#", "%23")
    print(f"Fetching battle log for player: {player_tag}")
    return api_get(f"/players/{encoded_tag}/battlelog", retries=retries)

def crawl_meta():
    print("Starting meta crawl...")
    usage_counts = defaultdict(int)
    win_counts = defaultdict(int)
    total_battles = 0

    player_tags = get_top_player_tags(limit=100)
    if not player_tags:
        print("No player tags retrieved. Exiting crawl.")
        return

    for i, tag in enumerate(player_tags, 1):
        print(f"[{i}/{len(player_tags)}] Processing player tag: {tag}")
        battles = get_battle_log(tag)
        if not battles:
            print(f"No battles retrieved for {tag}")
            continue

        for battle in battles:
            try:
                team = battle['team'][0]
                opponent = battle['opponent'][0]
                if 'cards' not in team or 'crowns' not in team or 'crowns' not in opponent:
                    print("Skipping battle due to missing data.")
                    continue

                team_cards = team['cards']
                team_win = team['crowns'] > opponent['crowns']

                for card in team_cards:
                    name = card['name']
                    usage_counts[name] += 1
                    if team_win:
                        win_counts[name] += 1

                total_battles += 1
            except (KeyError, IndexError, TypeError) as e:
                print(f"Skipping malformed battle: {e}")
                continue

        time.sleep(0.3)

    print("Building meta stats dictionary...")
    meta_stats = {
        name: {
            "usage_rate": usage_counts[name] / (total_battles * 8) if total_battles else 0,
            "win_rate": win_counts[name] / usage_counts[name] if usage_counts[name] else 0
        }
        for name in usage_counts
    }

    print("Updating database with meta stats...")
    with app.app_context():
        updated = 0
        not_found = 0
        for name, stats in meta_stats.items():
            card = CardMeta.query.filter_by(name=name).first()
            if card:
                card.usage_rate = stats["usage_rate"]
                card.win_rate = stats["win_rate"]
                updated += 1
            else:
                print(f"Card not found in DB: {name}")
                not_found += 1
        db.session.commit()
        print(f"Updated {updated} cards. {not_found} cards not found in DB.")

    print(f"Crawl complete. Processed {total_battles} battles across {len(player_tags)} players.")

if __name__ == "__main__":
    crawl_meta()
