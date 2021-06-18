from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Message(Base, Entity):
    __tablename__ = 'messages'

    src_user_uuid = Column(String, ForeignKey('users.uuid'), nullable=False)
    dst_user_uuid = Column(String, ForeignKey('users.uuid'), nullable=False)
    content = Column(String, nullable=False)
    read = Column(Boolean, default=False, nullable=False)

    # src_user = relationship...
    # dst_user = relationship...