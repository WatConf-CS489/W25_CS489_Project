from src.auth.verification_routes import sanitize_email

def email_error(email: str):
    try:
        sanitize_email(email)
    except ValueError as e:
        return str(e)
    return None

def test_sanitize_email():
    assert email_error("") is not None
    assert email_error("t") is not None
    assert email_error("test") is not None
    assert email_error("test@") is not None
    assert email_error("test@gmail.com") is not None
    assert email_error("test1.test2@uwaterloo.ca") is not None
    assert sanitize_email("test@uwaterloo.ca") == "test@uwaterloo.ca"
    assert sanitize_email("test1+@uwaterloo.ca") == "test1@uwaterloo.ca"
    assert sanitize_email("test1+foo@uwaterloo.ca") == "test1@uwaterloo.ca"
