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
