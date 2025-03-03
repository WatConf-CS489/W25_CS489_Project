from pydantic import BaseModel
from src.base import app
from src.extensions import db
from src.auth.user import get_current_user
from src.posts.post import Post
from flask import request, jsonify

class CreatePostRequest(BaseModel):
    content: str

@app.route("/post", methods=["POST"])
def create_post():
    body = CreatePostRequest.model_validate_json(request.data)

    if not body:
        return jsonify({'error': 'Invalid or missing JSON data'}), 400

    content = body.content

    if not content:
        return jsonify({'error': 'Missing required fields: content'}), 400

    try:
        new_post = Post(
            content=content,
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
    except Exception as err:
        db.session.rollback()
        return jsonify({'error': 'Error occurred creating post', 'msg': str(err)}), 500
