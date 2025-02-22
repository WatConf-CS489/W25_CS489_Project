import logging

from flask_alembic import Alembic
from flask_sqlalchemy import SQLAlchemy
from src.base import app, Base

logging.getLogger().setLevel(logging.INFO)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:password@db:5432/postgres"
)
db = SQLAlchemy(model_class=Base)
db.init_app(app)

alembic = Alembic()
alembic.init_app(app)

with app.app_context():
    alembic.upgrade()
