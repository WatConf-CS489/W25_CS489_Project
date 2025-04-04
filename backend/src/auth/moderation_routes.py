from flask import request, jsonify
from flask_login import login_required, current_user
from sqlalchemy import select
from datetime import datetime, timezone
from src.base import app
from src.extensions import db
from src.auth.user import User
from src.posts.post import Post
from src.auth.report import Report

def is_moderator():
    if not current_user.is_authenticated or not getattr(current_user, "is_moderator", False):
        return False
    return True

@app.route("/moderation/reports", methods=["GET"])
@login_required
def get_reports():
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    reports = db.session.query(Report).filter(Report.resolved_at.is_(None)).all()

    return jsonify([
        {
            "id": report.id,
            "reporter_id": str(report.reporter_id),
            "reportee_id": str(report.reportee_id),
            "post_id": report.post_id,
            "reason": report.reason,
            "post_content": (
                    db.session.query(Post.content)
                    .filter(Post.id == report.post_id, Post.deleted_at.is_(None))
                    .scalar() or "Post not found or deleted."
            )
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

    post = db.session.execute(
        select(Post).where(Post.id == post_id)
    ).scalar_one_or_none()

    if not post or post.is_deleted:
        return jsonify({"error": "Post not found or already deleted."}), 404

    return jsonify({"content": post.content})

@app.route("/moderation/remove-post", methods=["POST"])
@login_required
def remove_post():
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    data = request.get_json()
    post_id = data.get("post_id")
    if not post_id:
        return jsonify({"error": "Post ID required."}), 400

    post = db.session.execute(
        select(Post).where(Post.id == post_id)
    ).scalar_one_or_none()

    if not post or post.is_deleted:
        return jsonify({"error": "Post not found or already deleted."}), 404

    post.deleted_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({"message": "Post deleted successfully."})

@app.route("/moderation/resolve-report", methods=["POST"])
@login_required
def resolve_report():
    if not is_moderator():
        return jsonify({"error": "Moderator privileges required."}), 403

    data = request.get_json()
    report_id = data.get("report_id")
    if not report_id:
        return jsonify({"error": "Report ID required."}), 400

    report = db.session.execute(
        select(Report).where(Report.id == report_id)
    ).scalar_one_or_none()
    if not report:
        return jsonify({"error": "Report not found."}), 404

    report.resolved_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({"message": "Report resolved successfully."})

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