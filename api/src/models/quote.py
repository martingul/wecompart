from sqlalchemy import Column, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Quote(Base, Entity):
    __tablename__ = 'quotes'
    __table_args__ = (UniqueConstraint('owner_uuid', 'shipment_uuid', name='one_quote_per_user'),)

    owner_uuid = Column(String, ForeignKey('users.uuid'), nullable=False)
    shipment_uuid = Column(String, ForeignKey('shipments.uuid'), nullable=False)
    status = Column(String, nullable=False)
    delivery_date = Column(Date, nullable=False)
    stripe_quote_id = Column(String, nullable=True)
    comments = Column(String, nullable=True)

    owner = relationship('User', back_populates='quotes')
    shipment = relationship('Shipment', back_populates='quotes')
    bids = relationship('Bid', back_populates='quote')