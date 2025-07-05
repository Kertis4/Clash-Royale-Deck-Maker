import json
import os
import numpy as np

META_FILE = "meta.json"

def load_meta():
    if os.path.exists(META_FILE):
        with open(META_FILE, "r") as f:
            data = json.load(f)
            print(f"Loaded meta data keys: {list(data.keys())[:5]}")  
            return data
    print("Meta file not found, returning empty dict")
    return {}


meta_data = load_meta()

def build_deck(cards):
    print(f"Loaded meta data keys: {list(meta_data.keys())[:5]}")  
    if len(cards) < 8:
        return cards

    card_names = [card['name'] for card in cards]

    scores = []
    for name in card_names:
        stats = meta_data.get(name, {"usage_rate": 0, "win_rate": 0})
        score = stats["usage_rate"] * 0.3 + stats["win_rate"] * 0.7
        scores.append(score)

    scores = np.array(scores)
    # Normalize scores to sum to 1 for probabilities
    if scores.sum() == 0:
        probs = np.ones_like(scores) / len(scores)
    else:
        probs = scores / scores.sum()

    chosen_indices = np.random.choice(len(cards), size=8, replace=False, p=probs)
    deck = [cards[i] for i in chosen_indices]
    return deck
