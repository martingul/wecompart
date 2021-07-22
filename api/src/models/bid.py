from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base, Entity

class Bid(Base, Entity):
    __tablename__ = 'bids'

    quote_uuid = Column(String, ForeignKey('quotes.uuid'), nullable=False)
    service_uuid = Column(String, ForeignKey('services.uuid'), nullable=False)
    amount = Column(Integer, nullable=False)
    stripe_price_id = Column(String, nullable=True)

    quote = relationship('Quote', back_populates='bids')
    service = relationship('Service', back_populates='bids')