from sqlalchemy import text
from src.base import app
from src.extensions import db
import src.auth.routes

@app.route("/hello")
def hello_world():
    res = db.session.execute(text("SELECT 1+1")).one()[0]
    app.logger.info(f"1+1 = {res}")
    return "Hi from Flask!"
