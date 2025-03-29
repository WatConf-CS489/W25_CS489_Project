from datetime import datetime, timezone
from typing import TYPE_CHECKING
from src.auth.user import User
from src.base import DBModel
from src.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UUID, ForeignKey, Integer, Text, DateTime, func

if TYPE_CHECKING:
    from src.auth.vote import Vote

class Post(DBModel):
    __tablename__ = 'posts'

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True, server_default=func.gen_random_uuid())
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id: Mapped[UUID] = mapped_column(UUID, ForeignKey("user.id"), nullable=False)
    vote_count: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped['User'] = relationship("User", back_populates="posts")
    votes: Mapped[list['Vote']] = relationship("Vote", back_populates="post")

    def __repr__(self):
        return f'<Post ID {self.id}>'
