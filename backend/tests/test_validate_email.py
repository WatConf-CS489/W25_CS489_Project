from src.auth.verification_routes import validate_email

def email_error(email: str):
    try:
        validate_email(email)
    except ValueError as e:
        return str(e)
    return None

def test_validate_email():
    assert email_error("") == "Email must have exactly one '@' symbol"
    assert email_error("t") == "Email must have exactly one '@' symbol"
    assert email_error("test") == "Email must have exactly one '@' symbol"
    assert email_error("test@") == "Email must end with '@uwaterloo.ca'"
    assert email_error("test@gmail.com") == "Email must end with '@uwaterloo.ca'"
    assert email_error("t@uwaterloo.ca") == "Email must be at least 2 characters long"
    assert email_error("test1.test2@uwaterloo.ca") == "Email must not contain '.'. Please use your WatIAM username."
    assert email_error("test@uwaterloo.ca") is None
