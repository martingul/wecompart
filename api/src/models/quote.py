from sqlalchemy import Column, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Quote(Base, Entity):
    __tablename__ = 'quotes'

    owner_uuid = Column(String, ForeignKey('users.uuid'), nullable=False)
    shipment_uuid = Column(String, ForeignKey('shipments.uuid'), nullable=False)
    price = Column(Float, nullable=False)
    declined = Column(Boolean, default=False, nullable=False)

    owner = relationship('User', back_populates='quotes')
    shipment = relationship('Shipment', back_populates='quotes')