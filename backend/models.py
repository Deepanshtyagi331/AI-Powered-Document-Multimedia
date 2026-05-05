from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)
    content = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    timestamps = Column(Text, nullable=True)
    upload_time = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer) # For multi-user support
