from flask import abort, jsonify, request
from flask_login import login_required, login_user, logout_user
from sqlalchemy import select
from src.auth.user import User, get_current_user
from src.base import app
from src.extensions import db
from pydantic import BaseModel
import src.auth.registration_routes
import src.auth.login_routes

@app.route("/auth/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

@app.route("/profile")
@login_required
def profile():
    user = get_current_user()
    return jsonify({"message": f"Hello, {user.username}!"}), 200
