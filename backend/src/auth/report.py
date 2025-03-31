from src.base import DBModel
from sqlalchemy import UUID, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.auth.user import User
from src.posts.post import Post

class Report(DBModel):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reporter_id: Mapped[UUID] = mapped_column(UUID, ForeignKey("user.id"), nullable=False)
    reportee_id: Mapped[UUID] = mapped_column(UUID, ForeignKey("user.id"), nullable=False)
    post_id: Mapped[UUID] = mapped_column(UUID, ForeignKey("posts.id"), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)

    reporter: Mapped['User'] = relationship("User", foreign_keys=[reporter_id], backref="reports_made")
    reportee: Mapped['User'] = relationship("User", foreign_keys=[reportee_id], backref="reports_received")
    post: Mapped['Post'] = relationship("Post", backref="reports")

    def __repr__(self):
        return f"<Report {self.id} by {self.reporter_id} on {self.post_id}>"