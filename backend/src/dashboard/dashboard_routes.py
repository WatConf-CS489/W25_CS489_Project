from pydantic import BaseModel
from src.base import app
from src.extensions import db
from src.posts.post import Post
from sqlalchemy import desc
from flask import jsonify

class PostObject(BaseModel):
    time: int
    content: str

@app.route("/readAll", methods=["GET"])
def read_all_posts():
    try:
        all_posts = db.session.query(Post).order_by(desc(Post.created_at)).all()

        posts_array = [
            PostObject(
                time=int(post.created_at.timestamp()),
                content=post.content
            ).model_dump()
            for post in all_posts
        ]

        return jsonify({"posts": posts_array}), 200

    except Exception as err:
        return jsonify({"error": "Failed to fetch posts", "msg": str(err)}), 500
