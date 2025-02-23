from flask import abort, jsonify, request
from flask_login import login_required, login_user, logout_user
from sqlalchemy import select
from src.auth.user import User, get_current_user
from src.base import app
from src.extensions import db
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str
    remember: bool

@app.route("/auth/login", methods=["POST"])
def login():
    login_request = LoginRequest.model_validate_json(request.data)

    user = db.session.execute(
        select(User).where(User.username == login_request.username)
    ).scalar_one_or_none()

    if user is None:
        return abort(401, "Unauthorized")

    # TODO: do real auth
    if login_request.password != "password":
        return abort(401, "Unauthorized")

    login_user(user, remember=login_request.remember)

    return jsonify({"message": "Login successful"}), 200

@app.route("/auth/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@app.route("/profile")
@login_required
def profile():
    user = get_current_user()
    return jsonify({"message": f"Hello, {user.username}!"}), 200
