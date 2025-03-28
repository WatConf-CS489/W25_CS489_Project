from pydantic import BaseModel
from src.auth.user import User, get_current_user
from src.auth.vote import Vote
from src.base import app
from src.extensions import db
from src.posts.post import Post
from sqlalchemy import desc, insert, select
from flask import jsonify, request

class PostObject(BaseModel):
    id: str
    time: int
    content: str
    likes: int
    liked: bool

@app.route("/readAll", methods=["GET"])
def read_all_posts():
    try:
        all_posts = db.session.execute(
            select(Post)
            .join(Post.user)
            .where(User.deleted_at.is_(None))
            .order_by(desc(Post.created_at))
        ).scalars().all()

        posts_array = [
            PostObject(
                id=str(post.id),
                time=int(post.created_at.timestamp()),
                content=post.content,
                likes=len(post.votes),
                liked=any(vote.user_id == get_current_user().id for vote in post.votes)
            ).model_dump()
            for post in all_posts
        ]

        return jsonify({"posts": posts_array}), 200

    except Exception as err:
        app.logger.error(f"Error fetching posts: {err}")
        return jsonify({"error": "Failed to fetch posts"}), 500

class ToggleVoteRequest(BaseModel):
    post_id: str

@app.route("/toggle-vote", methods=["POST"])
def toggleVote():
    body = ToggleVoteRequest.model_validate_json(request.data)

    try:
        vote = db.session.scalars(
            select(Vote).where(Vote.user_id == get_current_user().id, Vote.post_id == body.post_id)
        ).one_or_none()

        if vote:
            db.session.delete(vote)
        else:
            db.session.execute(
                insert(Vote).values(
                    user_id=get_current_user().id,
                    post_id=body.post_id
                )
            )
        db.session.commit()
        return jsonify({"message": "Vote toggled successfully"}), 200

    except:
        db.session.rollback()
        return jsonify({"error": "Error occurred toggling vote"}), 500
