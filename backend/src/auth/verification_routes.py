from datetime import datetime, timezone
import uuid
from flask import Response, jsonify, request
from pydantic import BaseModel
from sqlalchemy import DateTime, select
from src.auth.ticket import get_public_key_pem, sign_blinded_ticket
from src.envs import get_base_url
from src.extensions import db
from src.base import DBModel, app
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID, String, Text, func


class EmailAddress(DBModel):
    __tablename__ = 'email'

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    email: Mapped[str] = mapped_column(Text(), unique=True, nullable=False)

    code: Mapped[str] = mapped_column(String(255), nullable=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


def validate_email(email: str):
    components = email.split("@")

    if len(components) != 2:
        raise ValueError("Email must have exactly one '@' symbol")
    
    [prefix, domain] = components

    if domain != "uwaterloo.ca":
        raise ValueError("Email must end with '@uwaterloo.ca'")
    
    if len(prefix) < 2:
        raise ValueError("Email must be at least 2 characters long")

    if prefix.find(".") != -1:
        raise ValueError("Email must not contain '.'. Please use your WatIAM username.")


def send_email_code(email: str, code: str):
    base = get_base_url()
    link = f"https://{base}/register/verify?code={code}"
    # TODO: send email
    app.logger.info(f"Sending email to '{email}' with code '{code}'. Link: {link}")


class SendEmailRequest(BaseModel):
    email: str

@app.route("/auth/verify/send", methods=["POST"])
def handler_send_email():
    body = SendEmailRequest.model_validate_json( request.data)

    try:
        validate_email(body.email)
    except ValueError as e:
        return {}, 400
    
    email = db.session.execute(
        select(EmailAddress).where(EmailAddress.email == body.email)
    ).scalar_one_or_none()

    if email is None:
        email = EmailAddress(email=body.email, code=str(uuid.uuid4()))
        db.session.add(email)
        db.session.commit()
        send_email_code(email.email, email.code)
    else:
        # don't error out, as that would leak whether the email is in the database
        pass

    return jsonify({"message": "Email sent if needed"}), 200


class ConfirmEmailRequest(BaseModel):
    code: str
    blinded_ticket: str

@app.route("/auth/verify/confirm", methods=["POST"])
def handler_confirm_email():
    body = ConfirmEmailRequest.model_validate_json(request.data)

    email = db.session.execute(
        select(EmailAddress).where(EmailAddress.code == body.code)
    ).scalar_one_or_none()

    if email is None:
        return jsonify({"error": "Invalid code"}), 400
    
    if email.verified_at is not None:
        return jsonify({"error": "Email already verified"}), 400
    
    email.verified_at = datetime.now(timezone.utc)
    db.session.commit()

    signed_ticket = sign_blinded_ticket(body.blinded_ticket)

    if signed_ticket is None:
        return jsonify({"error": "Invalid blinded ticket"}), 400

    return jsonify({"signed_ticket": signed_ticket}), 200


@app.route("/auth/verify/pubkey", methods=["GET"])
def handler_public_key():
    return Response(get_public_key_pem(), content_type="text/plain")
