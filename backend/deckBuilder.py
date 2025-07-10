import numpy as np

def build_deck(cards, meta_data):
    if len(cards) < 8:
        return cards

    card_names = [card['name'] for card in cards]

    scores = []
    for name in card_names:
        stats = meta_data.get(name, {"usage_rate": 0, "win_rate": 0})
        score = stats["usage_rate"] * 0.3 + stats["win_rate"] * 0.7
        scores.append(score)

    scores = np.array(scores)
    if scores.sum() == 0:
        probs = np.ones_like(scores) / len(scores)
    else:
        probs = scores / scores.sum()

    chosen_indices = np.random.choice(len(cards), size=8, replace=False, p=probs)
    deck = [cards[i] for i in chosen_indices]
    return deck
