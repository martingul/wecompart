from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Notification(Base, Entity):
    __tablename__ = 'notifications'

    user_uuid = Column(String, ForeignKey('users.uuid'), nullable=False)
    type = Column(String, nullable=False)
    content = Column(String, nullable=False)
    read = Column(Boolean, default=False, nullable=False)

    user = relationship('User', back_populates='notifications')
