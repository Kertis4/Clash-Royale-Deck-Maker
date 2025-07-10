from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    player_tag = db.Column(db.String(20), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False)

    def __init__(self, username, email, player_tag, password_hash):
        self.username = username
        self.email = email
        self.player_tag = player_tag
        self.password_hash = password_hash

    @classmethod
    def register(cls, email, password, player_tag, username):
        hashed = generate_password_hash(password)
        return cls(username=username, email=email, player_tag=player_tag, password_hash=hashed)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class CardMeta(db.Model):
    __tablename__ = 'card_meta'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    elixir_cost = db.Column(db.Integer)
    rarity = db.Column(db.String(50))
    icon_url = db.Column(db.String(300))
    card_id = db.Column(db.Integer, nullable=True)

    
    win_rate = db.Column(db.Float, nullable=True)   
    pick_rate = db.Column(db.Float, nullable=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'elixirCost': self.elixir_cost,
            'rarity': self.rarity,
            'iconUrl': self.icon_url,
            'cardId': self.card_id,
            'winRate': self.win_rate,
            'pickRate': self.pick_rate
        }
