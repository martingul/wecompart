from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Service(Base, Entity):
    __tablename__ = 'services'

    shipment_uuid = Column(String, ForeignKey('shipments.uuid'), nullable=False)
    name = Column(String, nullable=False)
    stripe_product_id = Column(String, nullable=True)

    shipment = relationship('Shipment', back_populates='services')
    bids = relationship('Bid', back_populates='service')