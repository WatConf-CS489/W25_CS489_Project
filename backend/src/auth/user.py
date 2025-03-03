from typing import List
from flask_login import UserMixin, current_user
# from datetime import datetime
from src.base import DBModel
from src.extensions import db, login_manager
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UUID, ForeignKey, Integer, LargeBinary, String, Text, func, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from argon2 import PasswordHasher
from webauthn.helpers.structs import AuthenticatorTransport
ph = PasswordHasher()
# based on https://github.com/duo-labs/duo-blog-going-passwordless-with-py-webauthn

class PasskeyCredential(DBModel):
    """A passkey credential"""
    __tablename__ = 'passkey_credential'

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    user_id: Mapped[UUID] = mapped_column(
        UUID, 
        ForeignKey('user.id'), 
        nullable=False
    )
    credential_id: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    public_key: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    sign_count: Mapped[int] = mapped_column(Integer, nullable=False)
    transports: Mapped[List[AuthenticatorTransport]] = mapped_column(JSONB, nullable=False)
    user: Mapped['User'] = relationship(back_populates='passkey_credentials')

class User(UserMixin, DBModel):
    __tablename__ = 'user'

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    username: Mapped[str] = mapped_column(String(63), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    is_banned: Mapped[bool] = mapped_column(Boolean, default=False)
    passkey_credentials: Mapped[List['PasskeyCredential']] = relationship(back_populates='user')
    ticket: Mapped[str] = mapped_column(Text(), unique=True)

    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password: str):
        """hashes and stores password"""
        self.password_hash = ph.hash(password)

    def check_password(self, password: str) -> bool:
        """verifies password against hash"""
        try:
            return ph.verify(self.password_hash, password)
        except Exception:
            return False
        
@login_manager.user_loader
def load_user(user_id: str):
    return db.session.get(User, user_id)

def get_current_user() -> User:
    if isinstance(current_user, User):
        return current_user
    else:
        raise ValueError("User is not logged in")