from flask import request, jsonify
from flask_login import login_required, current_user
from sqlalchemy import select, delete
from src.base import app
from src.extensions import db
from src.auth.user import User
from src.posts.post import Post
from src.auth.report import Report

# REPORTS = [
#     {"reporter_id": "uuid1", "reportee_id": "uuid2", "post_id": 12},
#     {"reporter_id": "uuid3", "reportee_id": "uuid4", "post_id": 17},
# ]

def is_moderator():
    if not current_user.is_authenticated or not getattr(current_user, "is_moderator", False):
        return False
    return True

@app.route("/moderation/reports", methods=["GET"])
@login_required
def get_reports():
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    reports = db.session.query(Report).all()

    return jsonify([
        {
            "id": report.id,
            "reporter_id": str(report.reporter_id),
            "reportee_id": str(report.reportee_id),
            "post_id": report.post_id
        }
        for report in reports
    ])

@app.route("/moderation/post-text", methods=["GET"])
@login_required
def get_post_text():
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    post_id = request.args.get("post_id")
    if not post_id:
        return jsonify({"error": "Post ID required."}), 400

    post = db.session.execute(select(Post).where(Post.id == int(post_id))).scalar_one_or_none()
    if post is None:
        return jsonify({"error": "Post not found."}), 404

    return jsonify({"content": post.content})

@app.route("/moderation/remove-post", methods=["POST"])
@login_required
def remove_post():
    """Remove a post by ID"""
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    data = request.get_json()
    post_id = data.get("post_id")
    if not post_id:
        return jsonify({"error": "Post ID required."}), 400

    result = db.session.execute(delete(Post).where(Post.id == int(post_id)))
    db.session.commit()
    if result.rowcount == 0:
        return jsonify({"error": "Post not found or already deleted."}), 404

    return jsonify({"message": "Post deleted successfully."})

@app.route("/moderation/ban-user", methods=["POST"])
@login_required
def ban_user():
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    data = request.get_json()
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID required."}), 400

    user = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        return jsonify({"error": "User not found."}), 404

    user.is_banned = True
    db.session.commit()
    return jsonify({"message": f"User {user.username} has been banned."})
