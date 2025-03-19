from src.base import app
import src.extensions
import src.routes
import src.models

@app.after_request
def add_csp_header(resp):
    resp.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'self';"
    return resp
