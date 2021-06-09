from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.auth import Session as AuthSession
from schemas.quote import QuoteRead, QuoteCreate, QuoteUpdate
from lib import auth, shipments, quotes

# TODO make sure these endpoints are restricted to shippers having access
# to the requested shipment

router = APIRouter()

@router.post('/{shipment_id}/quotes/', response_model=QuoteRead,
    status_code=status.HTTP_201_CREATED)
def create_shipment_quote(shipment_id: str, quote: QuoteCreate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Create a new shipment quote"""
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )
        
        quote_new_db = quotes.create_quote(db, quote, owner_uuid, shipment_db.uuid)
        quote_new = QuoteRead.from_orm(quote_new_db)
        return quote_new
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e

@router.get('/{shipment_id}/quotes/', response_model=List[QuoteRead])
def read_shipment_quotes(shipment_id: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[QuoteRead]:
    """Read shipment quotes"""
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)
        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        quotes_list = [QuoteRead.from_orm(x) for x in shipment_db.quotes]
        return quotes_list
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException):
            raise e 

@router.get('/{shipment_id}/quotes/{quote_id}', response_model=QuoteRead)
def read_shipment_quote(shipment_id: str, quote_id: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Read a shipment quote"""
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)
        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        quote_db = [x for x in shipment_db.quotes if x.uuid == quote_id]

        if not quote_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quote = QuoteRead.from_orm(quote_db[0])
        return quote
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e

@router.patch('/{shipment_id}/quotes/{quote_id}', response_model=QuoteRead)
def update_shipment_quote(shipment_id: str, quote_id: str, patch: QuoteUpdate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Update a shipment quote"""
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        quote_db = quotes.read_quote(db, quote_id, shipment_db.uuid)
        if quote_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quote_db = quotes.update_quote(db, quote_db, patch)
        quote = QuoteRead.from_orm(quote_db)
        return quote
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException): raise e

@router.delete('/{shipment_id}/quotes/{quote_id}', response_model=QuoteRead)
def delete_shipment_quote(shipment_id: str, quote_id: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Delete a shipment quote"""
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        quote_db = quotes.read_quote(db, quote_id, shipment_db.uuid)
        if quote_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quotes.delete_quote(db, quote_db)
        quote = QuoteRead.from_orm(quote_db)
        return quote
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e