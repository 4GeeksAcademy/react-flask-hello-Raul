from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    email: Mapped[str] = mapped_column(String(120), primary_key=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    # is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "email": self.email,
        }