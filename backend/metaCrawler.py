import requests
import os
import time
import json
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()
CLASH_API_TOKEN = os.getenv("META_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {CLASH_API_TOKEN}"}
META_FILE = "meta.json"

def get_top_players():
    url = "https://api.clashroyale.com/v1/locations/global/rankings/players"
    params = {"limit": 100}
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    data = response.json()
    return [player['tag'] for player in data['items']]

def get_battle_log(player_tag):
    tag = player_tag.replace('#', '%23')
    url = f"https://api.clashroyale.com/v1/players/{tag}/battlelog"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()

def crawl_meta():
    usage_counts = defaultdict(int)
    win_counts = defaultdict(int)
    total_battles = 0

    player_tags = get_top_players()

    for tag in player_tags:
        try:
            battles = get_battle_log(tag)
            for battle in battles:
                if 'team' not in battle or 'opponent' not in battle:
                    continue

                team_cards = battle['team'][0]['cards']
                team_win = battle['team'][0]['crowns'] > battle['opponent'][0]['crowns']

                for card in team_cards:
                    name = card['name']
                    usage_counts[name] += 1
                    if team_win:
                        win_counts[name] += 1

                total_battles += 1
            time.sleep(0.5)  
        except Exception as e:
            print(f"Error fetching battles for {tag}: {e}")
            continue

    meta_stats = {}
    for card_name in usage_counts:
        usage_rate = usage_counts[card_name] / (total_battles * 8) if total_battles > 0 else 0
        win_rate = win_counts[card_name] / usage_counts[card_name] if usage_counts[card_name] > 0 else 0
        meta_stats[card_name] = {
            "usage_rate": usage_rate,
            "win_rate": win_rate
        }

    with open(META_FILE, "w") as f:
        json.dump(meta_stats, f, indent=2)

    print(f"Meta data saved to {META_FILE}")

if __name__ == "__main__":
    crawl_meta()