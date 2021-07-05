from sqlalchemy import Column, String, Float, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Quote(Base, Entity):
    __tablename__ = 'quotes'
    __table_args__ = (UniqueConstraint('owner_uuid', 'shipment_uuid', name='one_quote_per_user'),)

    owner_uuid = Column(String, ForeignKey('users.uuid'), nullable=False)
    shipment_uuid = Column(String, ForeignKey('shipments.uuid'), nullable=False)
    status = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    delivery_date = Column(Date, nullable=False)

    owner = relationship('User', back_populates='quotes')
    shipment = relationship('Shipment', back_populates='quotes')