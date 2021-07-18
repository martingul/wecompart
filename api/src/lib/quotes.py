from datetime import datetime
from sqlalchemy.exc import IntegrityError
from error import ApiError

from storage import DatabaseSession
from schemas.quote import QuoteCreate, QuoteUpdate
from models.quote import Quote

def create_quote(db: DatabaseSession, quote: QuoteCreate,
    owner_uuid: str, shipment_uuid: str):
    try:
        quote_db = Quote(
            owner_uuid=owner_uuid,
            shipment_uuid=shipment_uuid,
            **quote.dict()
        )

        db.add(quote_db)
        db.commit()
        db.refresh(quote_db)
        return quote_db
    except Exception as e:
        db.rollback()
        print(e)
        if isinstance(e, IntegrityError):
            detail = 'error_max_quote_reached'
        else:
            detail = 'error_general'
        raise ApiError(detail)

def read_quote(db: DatabaseSession, quote_uuid: str, shipment_uuid: str):
    return db.query(Quote).filter(Quote.uuid == quote_uuid,
        Quote.shipment_uuid == shipment_uuid).first()

def _read_quote(db: DatabaseSession, quote_uuid: str):
    return db.query(Quote).filter(Quote.uuid == quote_uuid).first()

def update_quote(db: DatabaseSession, quote: Quote, patch: QuoteUpdate):
    for field, value in patch:
        if value is not None:
            setattr(quote, field, value)
    quote.updated_at = datetime.now()
    db.commit()
    db.refresh(quote)
    return quote

def delete_quote(db: DatabaseSession, quote: Quote):
    db.delete(quote)
    db.commit()
    return quote