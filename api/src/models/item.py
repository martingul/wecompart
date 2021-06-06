from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Item(Base, Entity):
    __tablename__ = 'items'

    owner_uuid = Column(String, ForeignKey('users.uuid'))
    shipment_uuid = Column(String, ForeignKey('shipments.uuid'))
    description = Column(String, nullable=True)
    quantity = Column(Integer, nullable=True)
    dim_unit = Column(String, nullable=True)
    length = Column(Float, nullable=True)
    width = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)

    owner = relationship('User', back_populates='items')
    shipment = relationship('Shipment', back_populates='items')