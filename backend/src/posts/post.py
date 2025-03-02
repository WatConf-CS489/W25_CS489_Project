import datetime
from src.base import DBModel
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID, ForeignKey, Text, func, DateTime, Integer

class Post(DBModel):
    __tablename__ = 'post'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    author: Mapped[UUID] = mapped_column(
        UUID,
        ForeignKey('user.id'),
        nullable=False
    )
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    content: Mapped[str] = mapped_column(Text(), nullable=False)

    def __repr__(self):
        return f'<Post ID {self.id}>'
