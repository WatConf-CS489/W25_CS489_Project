import uuid
from flask import jsonify, request
from flask_login import login_user
from pydantic import BaseModel
from sqlalchemy import select
from webauthn import generate_registration_options, options_to_json, verify_registration_response
from webauthn.registration.verify_registration_response import parse_registration_credential_json
from src.auth.user import PasskeyCredential, User
from src.extensions import db, r
from src.base import app

rp_id = "localhost"
rp_name = "WatConfessions"
rp_origins = [
    "http://localhost:3000"
]

class RegisterStartRequest(BaseModel):
    username: str

class RegisterStartResponse(BaseModel):
    challenge_id: str
    options: str

class RegistrationChallengeDTO(BaseModel):
    challenge: str
    username: str

# registration_challenges: dict[str, RegistrationChallengeDTO] = {}

@app.route("/auth/register/start", methods=["POST"])
def handler_registration_options():
    body = RegisterStartRequest.model_validate_json(request.data)

    options = generate_registration_options(
        rp_id=rp_id,
        rp_name=rp_name,
        user_name=body.username,
    )

    if db.session.execute(
        select(User).where(User.username == body.username)
    ).scalar_one_or_none():
        return jsonify({"error": "User already exists"}), 400

    challenge_id = str(uuid.uuid4())
    dto = RegistrationChallengeDTO(
        challenge=options.challenge.hex(),
        username=body.username,
    )
    r.set(f"registration_challenge:{challenge_id}", dto.model_dump_json(), ex=int(options.timeout or 60000 / 1000) * 2)

    return RegisterStartResponse(
        challenge_id=challenge_id,
        options=options_to_json(options),
    ).model_dump_json()


class RegisterRequest(BaseModel):
    credential: str
    challenge_id: str

@app.route("/auth/register/finish", methods=["POST"])
def handler_register():
    body = RegisterRequest.model_validate_json(request.data)
    dto = r.get(f"registration_challenge:{body.challenge_id}")
    if not isinstance(dto, bytes):
        return jsonify({"error": "Challenge not found"}), 400
    dto = RegistrationChallengeDTO.model_validate_json(dto)
    username = dto.username
    challenge = bytes.fromhex(dto.challenge)

    # even though we check in /start, we need to check again
    # to prevent TOCTOU races
    if db.session.execute(
        select(User).where(User.username == username)
    ).scalar_one_or_none():
        return jsonify({"error": "User already exists"}), 400

    try:
        credential = parse_registration_credential_json(body.credential)
        verification = verify_registration_response(
            credential=credential,
            expected_challenge=challenge,
            expected_rp_id=rp_id,
            expected_origin=rp_origins,
        )
    except Exception as err:
        return {"verified": False, "msg": str(err), "status": 400}

    user = User(username=username)
    db.session.add(user)
    db.session.flush()

    passkey = PasskeyCredential(
        credential_id=verification.credential_id.hex(),
        public_key=verification.credential_public_key,
        sign_count=verification.sign_count,
        transports=credential.response.transports or [],
        user_id=user.id,
    )
    db.session.add(passkey)
    db.session.commit()

    login_user(user)

    return {"verified": True}
