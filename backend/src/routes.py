from sqlalchemy import text
from src.base import app
from src.extensions import db
import src.auth.routes
import src.posts.post_routes
import src.dashboard.dashboard_routes

@app.route("/healthcheck")
def healthcheck():
    return "I'm alive!"
