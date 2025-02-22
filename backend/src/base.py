from flask import Flask
from sqlalchemy.orm import DeclarativeBase

app = Flask(__name__)


class Base(DeclarativeBase):
    pass
