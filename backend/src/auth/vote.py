from datetime import datetime, timezone
from src.base import DBModel
from src.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UUID, ForeignKey, DateTime

class Vote(DBModel):
    __tablename__ = 'votes'

    user_id: Mapped[UUID] = mapped_column(UUID, ForeignKey("user.id"), primary_key=True)
    post_id: Mapped[UUID] = mapped_column(UUID, ForeignKey("posts.id"), primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    user: Mapped['User'] = relationship("User", back_populates="votes")
    post: Mapped['Post'] = relationship("Post", back_populates="votes")

from .user import User
from .post import Post

User.votes = relationship("Vote", back_populates="user")
Post.votes = relationship("Vote", back_populates="post")