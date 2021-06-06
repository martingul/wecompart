from sqlalchemy import Column, String
from sqlalchemy.orm import relationship, validates
from models.base import Base, Entity

class Shipper(Base, Entity):
    __tablename__ = 'shippers'

    email_domain = Column(String, default='', nullable=False)
    emails = Column(String, nullable=True)
    country = Column(String, default='', nullable=False)
    name = Column(String, nullable=True)

    users = relationship('User', back_populates='shipper')

    @validates('emails')
    def validate_emails(self, key, field):
        if isinstance(field, list):
            return ','.join(field)
        return field
