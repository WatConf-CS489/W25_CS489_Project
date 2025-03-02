import uuid
from src.extensions import db
from src.auth.user import User
from src.auth.post import Post
from src.auth.vote import Vote
from sqlalchemy.exc import IntegrityError

def seed_database():
    try:
        print("Seeding database...")

        # Create users
        user1 = User(id=uuid.uuid4(), username="alice")
        user1.set_password("securepassword1") 
        user2 = User(id=uuid.uuid4(), username="bob")
        user2.set_password("securepassword2")

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        
        # Create posts
        post1 = Post(id=uuid.uuid4(), content="i love the french vanilla at c&d", user_id=user1.id)
        post2 = Post(id=uuid.uuid4(), content="i might drop out any second.", user_id=user2.id)

        db.session.add(post1)
        db.session.add(post2)
        db.session.commit()

        print("Database seeding is done!")

    except IntegrityError:
        db.session.rollback()
        print("Data already exists, skipping seeding.")

if __name__ == "__main__":
    seed_database()