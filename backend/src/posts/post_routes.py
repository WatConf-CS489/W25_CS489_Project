from pydantic import BaseModel
from src.base import app
from src.extensions import db
from src.auth.user import get_current_user
from src.posts.post import Post
from src.posts.post_ai import flagged_categories
from flask import request, jsonify
from html import escape
from sqlalchemy import select, func
from datetime import datetime, timedelta

class CreatePostRequest(BaseModel):
    content: str

def escape_html(content):
    # Wrapper for stdlib html.escape
    return escape(content)

@app.route("/post", methods=["POST"])
def create_post():
    body = CreatePostRequest.model_validate_json(request.data)

    if not body:
        return jsonify({'error': 'Invalid or missing JSON data'}), 400

    content = body.content

    if not content:
        return jsonify({'error': 'Missing required fields: content'}), 400
    
    #rate limit check: max 10 posts in 24 hours
    user_id = get_current_user().id
    since = datetime.now() - timedelta(hours=24)

    post_count = db.session.query(func.count(Post.id))\
        .filter(Post.user_id == user_id)\
        .filter(Post.created_at >= since)\
        .scalar()
    if post_count >= 10:
        return jsonify({'error': 'Rate limit exceeded'}), 429
    
    escaped_content = escape_html(content)

    post_flags = flagged_categories(escaped_content)
    if len(post_flags) > 0:
        return jsonify({'error': 'Post content flagged as dangerous', 'flags': post_flags}), 400

    try:
        new_post = Post(
            content=escaped_content,
            user_id=get_current_user().id
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify({
            'message': 'Post created successfully',
            'post': {
                'id': str(new_post.id),
                'created_at': new_post.created_at,
                'user_id': new_post.user_id
            }
        }), 201

    except:
        db.session.rollback()
        return jsonify({'error': 'Error occurred creating post'}), 500
