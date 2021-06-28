from sqlalchemy import Column, String, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from models.base import Base, Entity

class Shipment(Base, Entity):
    __tablename__ = 'shipments'

    owner_uuid = Column(String, ForeignKey('users.uuid'))
    status = Column(String, nullable=False)
    access_token = Column(String, nullable=True)

    pickup_address_id = Column(String, nullable=True)
    pickup_address_long = Column(String, nullable=True)
    pickup_address_short = Column(String, nullable=True)
    pickup_date = Column(Date, nullable=True)

    delivery_address_id = Column(String, nullable=True)
    delivery_address_long = Column(String, nullable=True)
    delivery_address_short = Column(String, nullable=True)

    country = Column(String, nullable=False)

    currency = Column(String, nullable=True)
    total_value = Column(Float, nullable=True)
    services = Column(ARRAY(String), default=[], nullable=False)
    comments = Column(String, nullable=True)

    owner = relationship('User', back_populates='shipments')
    items = relationship('Item', back_populates='shipment')
    quotes = relationship('Quote', back_populates='shipment')