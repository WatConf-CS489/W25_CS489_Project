import logging
from flask_cors import CORS
from src.base import db
from src.base import app

logging.getLogger().setLevel(logging.INFO)

CORS(app, supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql+psycopg2://postgres:password@db:5432/postgres"
db.init_app(app)
