import requests
import os
import time
import json
from collections import defaultdict
from dotenv import load_dotenv


load_dotenv()
API_TOKEN = os.getenv("META_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}
BASE_URL = "https://api.clashroyale.com/v1"

META_FILE = "meta.json"
PARTIAL_FILE = "meta_partial.json"


def api_get(endpoint, params=None, retries=3, sleep_time=1.5):
    url = f"{BASE_URL}{endpoint}"
    for attempt in range(1, retries + 1):
        try:
            response = requests.get(url, headers=HEADERS, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"[Retry {attempt}/{retries}] Error: {e}")
            time.sleep(sleep_time)
    print(f"Failed after {retries} retries: {url}")
    return None


def get_top_player_tags(limit=100):
    data = api_get("/locations/global/rankings/players", params={"limit": limit})
    if not data:
        return []
    tags = [item["tag"] for item in data.get("items", [])]
    print(f"Fetched {len(tags)} players from global rankings")
    return tags


def get_battle_log(player_tag, retries=3):
    encoded_tag = player_tag.replace("#", "%23")
    return api_get(f"/players/{encoded_tag}/battlelog", retries=retries)


def save_partial(meta_stats):
    with open(PARTIAL_FILE, "w") as f:
        json.dump(meta_stats, f, indent=2)
    print(f"Saved partial progress to {PARTIAL_FILE}")


def crawl_meta():
    usage_counts = defaultdict(int)
    win_counts = defaultdict(int)
    total_battles = 0

    player_tags = get_top_player_tags(limit=100)

    for i, tag in enumerate(player_tags, 1):
        battles = get_battle_log(tag)
        if not battles:
            continue

        for battle in battles:
            try:
                team = battle['team'][0]
                opponent = battle['opponent'][0]
                if 'cards' not in team or 'crowns' not in team or 'crowns' not in opponent:
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
                print(f"⚠️ Skipping malformed battle: {e}")
                continue

        if i % 10 == 0:
            print(f"Progress: {i}/{len(player_tags)} players processed. Battles: {total_battles}")
            partial_stats = {
                name: {
                    "usage_rate": usage_counts[name] / (total_battles * 8) if total_battles else 0,
                    "win_rate": win_counts[name] / usage_counts[name] if usage_counts[name] else 0
                }
                for name in usage_counts
            }
            save_partial(partial_stats)

        time.sleep(0.3)  

   
    meta_stats = {
        name: {
            "usage_rate": usage_counts[name] / (total_battles * 8) if total_battles else 0,
            "win_rate": win_counts[name] / usage_counts[name] if usage_counts[name] else 0
        }
        for name in usage_counts
    }

    with open(META_FILE, "w") as f:
        json.dump(meta_stats, f, indent=2)

    print(f"Crawl complete. Processed {total_battles} battles across {len(player_tags)} players.")
    print(f"Meta data saved to {META_FILE}")

if __name__ == "__main__":
    crawl_meta()
