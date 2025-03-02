import datetime
from src.base import DBModel
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID, Text, func, DateTime

class Post(DBModel):
    __tablename__ = 'post'

    id: Mapped[UUID] = mapped_column(UUID, primary_key=True, autoincrement=True)
    author: Mapped[UUID] = mapped_column(UUID, nullable=False)
    date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    content: Mapped[str] = mapped_column(Text(), nullable=False)

    def __repr__(self):
        return f'<Post ID {self.id}>'
