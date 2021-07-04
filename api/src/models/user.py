from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_utils import PasswordType
from models.base import Base, Entity

class User(Base, Entity):
    __tablename__ = 'users'

    # XXX maybe don't index `username` if it is never used as a filter
    # currently used when authenticated (search by username)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(PasswordType(schemes=['bcrypt']), nullable=False)

    shipper_uuid = Column(String, ForeignKey('shippers.uuid'), nullable=True)
    name = Column(String, nullable=True)
    role = Column(String, nullable=False, default='standard')

    session = relationship('Session', back_populates='user', uselist=False)
    shipper = relationship('Shipper', back_populates='users')
    shipments = relationship('Shipment', back_populates='owner')
    items = relationship('Item', back_populates='owner')
    quotes = relationship('Quote', back_populates='owner')
    notifications = relationship('Notification', back_populates='user',
        order_by='desc(Notification.created_at)')