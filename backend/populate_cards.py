import os
import requests
from dotenv import load_dotenv
from app import app, db
from user import CardMeta

load_dotenv()
API_TOKEN = os.getenv("CLASH_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}
BASE_URL = "https://api.clashroyale.com/v1"

def fetch_cards():
    response = requests.get(f"{BASE_URL}/cards", headers=HEADERS)
    if response.status_code == 200:
        return response.json().get("items", [])
    else:
        print(f"Error fetching cards: {response.status_code}")
        return []

def populate_cards():
    cards = fetch_cards()
    with app.app_context():
        for card in cards:
            name = card.get("name")
            if not name:
                continue

            if CardMeta.query.filter_by(name=name).first():
                print(f"Card already exists: {name}")
                continue

            new_card = CardMeta(
                name=name,
                elixir_cost=card.get("elixirCost"),
                rarity=card.get("rarity"),
                icon_url=card.get("iconUrls", {}).get("medium"),
                card_id=card.get("id")
            )
            db.session.add(new_card)
            print(f"Added card: {name}")

        db.session.commit()
        print("Card population complete.")

if __name__ == "__main__":
    populate_cards()
