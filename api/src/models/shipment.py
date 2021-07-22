from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Shipment(Base, Entity):
    __tablename__ = 'shipments'

    owner_uuid = Column(String, ForeignKey('users.uuid'))
    status = Column(String, nullable=False)
    access_token = Column(String, nullable=True)
    stripe_invoice_id = Column(String, nullable=True)

    pickup_address_id = Column(String, nullable=True)
    pickup_address_long = Column(String, nullable=True)
    pickup_address_short = Column(String, nullable=True)
    pickup_date = Column(Date, nullable=True)

    delivery_address_id = Column(String, nullable=True)
    delivery_address_long = Column(String, nullable=True)
    delivery_address_short = Column(String, nullable=True)

    map_url = Column(String, nullable=False)
    country = Column(String, nullable=False)

    currency = Column(String, nullable=True) # TODO use user's currency
    total_value = Column(Float, nullable=True) # TODO change to int
    comments = Column(String, nullable=True)

    owner = relationship('User', back_populates='shipments')
    items = relationship('Item', back_populates='shipment')
    services = relationship('Service', back_populates='shipment')
    quotes = relationship('Quote', back_populates='shipment')