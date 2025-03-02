import logging
from flask_alembic import Alembic
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from redis import Redis
from src.base import app, DBModel
# from dotenv import load_dotenv


logging.getLogger().setLevel(logging.INFO)

# load_dotenv("backend/envs/common.env")
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback-secret-key")
# app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
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

r = Redis(host="redis", port=6379, db=0, protocol=3)
