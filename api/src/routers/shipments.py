from typing import Optional
from fastapi import APIRouter, Header, Response, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.shipment import ShipmentRead, ShipmentCreate, ShipmentUpdate
from schemas.quote import QuoteStatus
from lib import auth, shipments, quotes, users

router = APIRouter()

@router.get('/', response_model=list[ShipmentRead])
def read_shipments(skip: int = 0, limit: int = 100,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> list[ShipmentRead]:
    """Read all shipments of a user"""
    try:
        owner_uuid = session.user_uuid
        shipments_db = shipments.read_shipments(db, owner_uuid, skip=skip, limit=limit)
        shipments_list = [ShipmentRead.from_orm(i) for i in shipments_db]
        return shipments_list
    except Exception as e:
        print(e)
        raise e

@router.post('/', response_model=ShipmentRead, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Create a new shipment"""
    try:
        # TODO validate shipment (use pydantic validator)
        # TODO check for shipment status and act accordingly
        owner_uuid = session.user_uuid

        # TODO send to shipper.emails and notify each user with same email domain
        # candidate_shippers = shippers.read_candidate_shippers(db, shipment.country)

        shipment.access_token = auth.generate_token()

        shipment_new_db = shipments.create_shipment(db, shipment, owner_uuid)
        shipment_new = ShipmentRead.from_orm(shipment_new_db)
        return shipment_new
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='error_invalid_shipment'
        )

@router.get('/{shipment_id}', response_model=ShipmentRead)
def read_shipment(shipment_id: str, access_token: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Read a user's shipment"""
    try:
        shipment_db = shipments.read_shipment(db, shipment_id)
    except Exception as e:
        print(vars(e))
    if shipment_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='error_shipment_not_found'
        )

    user_uuid = None
    try:
        _, user_uuid = auth.parse_header(authorization)
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException) and access_token is not None:
            valid_access_token = shipment_db.access_token == access_token.strip().lower()
            if not valid_access_token:
                raise e
        else:
            raise e

    if user_uuid is not None and shipment_db.owner_uuid != user_uuid:
        try:
            user_db = users.read_user(db, index=user_uuid, by='uuid')
        except Exception as e:
            print(e)
            raise e
        if user_db.role != 'shipper':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    try: 
        shipment = ShipmentRead.from_orm(shipment_db)
        if shipment_db.owner_uuid == user_uuid:
            accepted_quote = [q for q in shipment.quotes if q.status == QuoteStatus.accepted]
            if accepted_quote:
                accepted_quote = accepted_quote[0]
                accepted_quote.stripe_data = quotes.read_stripe_quote(accepted_quote)
            print(accepted_quote)
        if shipment_db.owner_uuid != user_uuid and shipment.quotes:
            print(shipment.quotes, end='\n\n')
            _quotes = {}
            user_quote = [q for q in shipment.quotes if q.owner.uuid == user_uuid]
            if user_quote:
                _quotes[user_quote[0].uuid] = user_quote[0]
            cheapest_quote = shipment.quotes[0] # FIXME might not be ordered by price at all
            earliest_quote = sorted(shipment.quotes, key=lambda q: q.delivery_date)[0]
            print(cheapest_quote, end='\n\n')
            print(earliest_quote, end='\n\n')
            _quotes[cheapest_quote.uuid] = cheapest_quote
            _quotes[earliest_quote.uuid] = earliest_quote

            print(_quotes, end='\n\n')
            shipment.quotes = list(_quotes.values())
        return shipment
    except Exception as e:
        print(e)
        raise e

@router.patch('/{shipment_id}', response_model=ShipmentRead)
def update_shipment(shipment_id: str, patch: ShipmentUpdate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Update a user's shipment"""
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        shipment_db = shipments.update_shipment(db, shipment_db, patch)
        shipment = ShipmentRead.from_orm(shipment_db)
        return shipment
    except Exception as e:
        print(e)
        raise e

@router.delete('/{shipment_id}')
def delete_shipment(shipment_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Delete a user's shipment"""
    # TODO don't delete but disable
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        shipments.delete_shipment(db, shipment_db)
        return Response(status.HTTP_200_OK)
    except Exception as e:
        print(e)
        raise e