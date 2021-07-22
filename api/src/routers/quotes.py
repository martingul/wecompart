import re
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.quote import QuoteRead, QuoteCreate, QuoteUpdate, QuoteStatus, QuoteStripe
from schemas.notification import NotificationRead, NotificationCreate
from lib import auth, shipments, quotes, notifications
from error import ApiError

# TODO make sure these endpoints are restricted to shippers having access
# to the requested shipment

router = APIRouter()

# @router.get('/quotes/', response_model=list[QuoteRead])
# def read_quotes(session: Session = Depends(auth.auth_session),
#     db: DatabaseSession = Depends(db_session)) -> list[QuoteRead]:
#     """Read quotes"""
#     try:
#         owner_uuid = session.user_uuid
#         shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)
#         if shipment_db is None:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail='error_shipment_not_found'
#             )

#         quotes_list = [QuoteRead.from_orm(x) for x in shipment_db.quotes]
#         return quotes_list
#     except Exception as e:
#         print(e)
#         if isinstance(e, HTTPException):
#             raise e 

@router.post('/', response_model=QuoteRead,
    status_code=status.HTTP_201_CREATED)
async def create_quote(quote: QuoteCreate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Create a new quote"""
    # TODO check for permissions
    try:
        if session.user.role != 'shipper':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

        shipment_db = shipments.read_shipment(db, quote.shipment_uuid)

        if session.user.uuid == shipment_db.owner_uuid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        quote_new_db = quotes.create_quote(db, quote,
            owner_uuid=session.user.uuid,
            account_id=session.user.stripe_account_id,
            customer_id=shipment_db.owner.stripe_customer_id
        )
        quote_new = QuoteRead.from_orm(quote_new_db)

        notification_new = NotificationCreate(
            user_uuid=shipment_db.owner_uuid,
            type='new_quote',
            content=quote_new.json()
        )

        notification_db = notifications.create_notification(db, notification_new)
        notification = NotificationRead.from_orm(notification_db)
        await notifications.send_notification(shipment_db.owner_uuid, notification)

        return quote_new
    except ApiError as e:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        if e.detail == 'error_max_quote_reached':
            status_code = status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=status_code, detail=e.detail)
    except Exception as e:
        print(e)
        raise e

@router.get('/{quote_id}', response_model=QuoteRead)
def read_quote(quote_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Read a quote"""
    # TODO check for permissions
    try:
        quote_db = quotes._read_quote(db, quote_id)

        if not quote_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quote = QuoteRead.from_orm(quote_db)
        quote.stripe = quotes.read_stripe_quote(quote_db)

        return quote
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException):
            raise e

@router.patch('/{quote_id}', response_model=QuoteRead)
def update_quote(quote_id: str, patch: QuoteUpdate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Update a shipment quote"""
    # TODO notify quote owner on status change
    # TODO check for permissions
    try:
        quote_db = quotes._read_quote(db, quote_id)
        if quote_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quote_db = quotes.update_quote(db, quote_db, patch)
        quote = QuoteRead.from_orm(quote_db)

        if not quote.stripe:
            quote.stripe = QuoteStripe()

        if patch.status == QuoteStatus.accepted:
            quote.stripe.stripe_invoice_url = quotes.accept_quote(quote_db)

        return quote
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException):
            raise e

@router.delete('/{quote_id}', response_model=QuoteRead)
def delete_quote(quote_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> QuoteRead:
    """Delete a shipment quote"""
    # TODO check for permissions
    try:
        if session.user.role != 'shipper':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

        quote_db = quotes._read_quote(db, quote_id)
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

@router.post('/{quote_id}/release')
def release_quote(quote_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)):
    try:
        quote_db = quotes._read_quote(db, quote_id)

        if not quote_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quotes.release_quote(quote_db)       
    except Exception as e:
        print(e)
        raise e

@router.get('/{quote_id}/download')
def download_quote(quote_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)):
    try:
        quote_db = quotes._read_quote(db, quote_id)

        if not quote_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        quote_pdf_stream = quotes.download_quote(quote_db)
        filename_header = quote_pdf_stream.headers['Content-Disposition']
        match = re.search(r'".*[.]pdf"', filename_header)
        if match:
            filename = match[0]
        else:
            filename = f'Quote.pdf' # TODO get quote id from stripe?

        return StreamingResponse(
            quote_pdf_stream.io.stream(),
            headers={
                'Content-Disposition': f'attachment; filename={filename}',
            },
            media_type='application/pdf'
        )
    except Exception as e:
        print(e)
        raise e