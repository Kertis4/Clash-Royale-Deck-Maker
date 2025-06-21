import random

def build_deck(cards):
    if len(cards) < 8:
        return cards  

  
    deck = random.sample(cards, 8)
    return deck
