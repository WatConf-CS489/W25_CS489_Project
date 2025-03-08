import logging
import os
from flask_alembic import Alembic
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from redis import Redis
from src.base import app, DBModel


logging.getLogger().setLevel(logging.INFO)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

logging.getLogger().setLevel(logging.INFO)

db = SQLAlchemy(model_class=DBModel)
db.init_app(app)

alembic = Alembic()
alembic.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

r = Redis(host="redis", port=6379, db=0, protocol=3)