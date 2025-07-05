from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username, email, password_hash):
        self.username = username
        self.email = email
        self.password_hash = password_hash

    @classmethod
    def register(cls, username, email, password):
        hashed = generate_password_hash(password)
        return cls(username, email, hashed)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
