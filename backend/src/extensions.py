import logging

from flask_alembic import Alembic
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from src.base import app, DBModel

logging.getLogger().setLevel(logging.INFO)

# TODO: use env vars for config secrets

app.config["SECRET_KEY"] = "5c163204ada16dd62b2d8af7f6b66b175179d9a1291bce32e9a94c36f00cad76"

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:password@db:5432/postgres"
)
db = SQLAlchemy(model_class=DBModel)
db.init_app(app)

alembic = Alembic()
alembic.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
