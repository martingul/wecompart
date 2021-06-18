from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_utils import PasswordType
from models.base import Base, Entity

class Session(Base, Entity):
    __tablename__ = 'sessions'

    user_uuid = Column(String, ForeignKey('users.uuid'), unique=True, index=True, nullable=False)
    token = Column(PasswordType(schemes=['sha256_crypt']), nullable=False)
    expires_in = Column(DateTime, nullable=True)

    user = relationship('User', back_populates='session')