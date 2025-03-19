from flask import Flask
from sqlalchemy.orm import DeclarativeBase

app = Flask(__name__)

@app.after_request
def add_csp_header(resp):
    resp.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'self';"
    return resp

class DBModel(DeclarativeBase):
    pass
