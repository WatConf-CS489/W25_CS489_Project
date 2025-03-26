import uuid
from pydantic import BaseModel
from src.base import app
from src.extensions import db, r
from src.auth.user import PasskeyCredential, User
from sqlalchemy import select
from flask import request, abort, jsonify
from flask_login import login_user
from webauthn import generate_authentication_options, options_to_json
from webauthn.authentication.verify_authentication_response import verify_authentication_response, parse_authentication_credential_json
from src.auth.registration_routes import rp_id, rp_origins
from webauthn.helpers.structs import PublicKeyCredentialDescriptor

class LoginStartRequest(BaseModel):
    username: str | None = None

class LoginStartResponse(BaseModel):
    challenge_id: str
    options: str

class LoginFinishRequest(BaseModel):
    credential: str
    challenge_id: str
    remember: bool

@app.route("/auth/login/start", methods=["POST"])
def login_start():
    body = LoginStartRequest.model_validate_json(request.data)

    if body.username:
        user = db.session.execute(
            select(User).where(User.username == body.username)
        ).scalar_one_or_none()
        if not user:
            return jsonify({"error": "User not found"}), 400
        credentials = db.session.execute(
            select(PasskeyCredential).where(PasskeyCredential.user_id == user.id)
        ).scalars().all()
        allowed_credentials = [
            PublicKeyCredentialDescriptor(
                id=bytes.fromhex(cred.credential_id),
                transports=None,
            )
            for cred in credentials
        ]
    else:
        allowed_credentials = None

    challenge_id = str(uuid.uuid4())

    options = generate_authentication_options(
        rp_id=rp_id,
        allow_credentials=allowed_credentials,
    )

    r.set(f"login_challenge:{challenge_id}", options.challenge, ex=int(options.timeout or 60000 / 1000) * 2)

    return LoginStartResponse(
        challenge_id=challenge_id,
        options=options_to_json(options),
    ).model_dump_json()

@app.route("/auth/login/finish", methods=["POST"])
def login_finish():
    body = LoginFinishRequest.model_validate_json(request.data)

    credential = parse_authentication_credential_json(body.credential)

    db_credential = db.session.execute(
        select(PasskeyCredential).where(PasskeyCredential.credential_id == credential.raw_id.hex())
    ).scalar_one()

    user = db.session.execute(
        select(User).where(User.id == db_credential.user_id)
    ).scalar_one()

    try:
        challenge = r.get(f"login_challenge:{body.challenge_id}")
        if not isinstance(challenge, bytes):
            return jsonify({"error": "Challenge not found"}), 400
        verification = verify_authentication_response(
            credential=credential,
            expected_challenge=challenge,
            expected_rp_id=rp_id,
            expected_origin=rp_origins,
            credential_public_key=db_credential.public_key,
            credential_current_sign_count=db_credential.sign_count,
        )
    except Exception as err:
        return jsonify({"verified": False, "status": 400}), 400

    db_credential.sign_count = verification.new_sign_count

    login_user(user=user, remember=body.remember)

    return jsonify({"verified": True}), 200
