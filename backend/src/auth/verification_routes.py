from datetime import datetime, timezone
import uuid
from flask import jsonify, request
from pydantic import BaseModel
from sqlalchemy import DateTime, select
from src.auth.ticket import sign_blinded_ticket
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


def is_valid_email(email: str) -> bool:
    # TODO: disallow aliases?
    return email.endswith("@uwaterloo.ca")


def send_email_code(email: str, code: str):
    link = f"https://local.kabir.dev/register/verify?code={code}"
    app.logger.info(f"Sending email to '{email}' with code '{code}'. Link: {link}")


class SendEmailRequest(BaseModel):
    email: str

@app.route("/auth/verify/send", methods=["POST"])
def handler_send_email():
    body = SendEmailRequest.model_validate_json( request.data)

    if not is_valid_email(body.email):
        return jsonify({"error": "Invalid email"}), 400
    
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
    return jsonify({"signed_ticket": signed_ticket}), 200
