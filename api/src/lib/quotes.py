from datetime import datetime
from sqlalchemy.orm import Session

from schemas.quote import QuoteCreate, QuoteUpdate
from models.quote import Quote

def create_quote(db: Session, quote: QuoteCreate,
    owner_uuid: str, shipment_uuid: str):
    quote_db = Quote(
        owner_uuid=owner_uuid,
        shipment_uuid=shipment_uuid,
        **quote.dict()
    )

    db.add(quote_db)
    db.commit()
    db.refresh(quote_db)

    return quote_db

def read_quotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Quote).offset(skip).limit(limit).all()

def read_quote(db: Session, quote_uuid: str, shipment_uuid: str):
    return db.query(Quote).filter(Quote.uuid == quote_uuid,
        Quote.shipment_uuid == shipment_uuid).first()

def update_quote(db: Session, quote: Quote, patch: QuoteUpdate):
    for field, value in patch:
        if value is not None:
            setattr(quote, field, value)
    quote.updated_at = datetime.now()
    db.commit()
    db.refresh(quote)
    return quote

def delete_quote(db: Session, quote: Quote):
    db.delete(quote)
    db.commit()
    return quote