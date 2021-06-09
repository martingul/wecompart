from typing import List, Optional
from fastapi import APIRouter, Header, Response, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.auth import Session as AuthSession
from schemas.shipment import ShipmentRead, ShipmentCreate, ShipmentUpdate
from lib import auth, shipments, templates

router = APIRouter()

@router.get('/locations')
def read_locations(
    q: str, auth_session: AuthSession = Depends(auth.auth_session)
):
    # TODO validate query
    return shipments.read_locations(q)

@router.get('/locations/{location_id}')
def read_location(
    location_id: str, auth_session: AuthSession = Depends(auth.auth_session)
):
    # TODO validate query
    return shipments.read_location(location_id)

@router.post('/', response_model=ShipmentRead, status_code=status.HTTP_201_CREATED)
def create_shipment(shipment: ShipmentCreate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Create a new shipment"""
    try:
        print(auth_session)
        # TODO validate shipment (use pydantic validator)
        owner_uuid = auth_session.user_uuid

        pickup_location = shipments.read_location(shipment.pickup_address_id)
        shipment.pickup_address_long = pickup_location['long']
        shipment.pickup_address_short = pickup_location['short']

        delivery_location = shipments.read_location(shipment.delivery_address_id)
        shipment.delivery_address_long = delivery_location['long']
        shipment.delivery_address_short = delivery_location['short']

        shipment_new_db = shipments.create_shipment(db, shipment, owner_uuid)
        shipment_new = ShipmentRead.from_orm(shipment_new_db)
        return shipment_new
    except Exception as e:
        print(vars(e))
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='error_invalid_shipment'
            )

@router.get('/', response_model=List[ShipmentRead])
def read_shipments(skip: int = 0, limit: int = 100,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[ShipmentRead]:
    """Read all shipments of a user"""
    try:
        owner_uuid = auth_session.user_uuid
        shipments_db = shipments.read_shipments(db, owner_uuid, skip=skip, limit=limit)
        shipments_list = [ShipmentRead.from_orm(i) for i in shipments_db]
        return shipments_list
    except Exception as e:
        print(vars(e))

@router.get('/{shipment_id}', response_model=ShipmentRead)
def read_shipment(shipment_id: str, access_token: Optional[str] = None,
    authorization: Optional[str] = Header(None),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Read a user's shipment"""
    shipment_db = None
    try:
        shipment_db = shipments._read_shipment(db, shipment_id)
    except Exception as e:
        print(vars(e))
        print('error db')

    if shipment_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='error_shipment_not_found'
        )

    owner_uuid = None
    valid_access_token = False

    try:
        auth_session = auth.parse_authorization(db, authorization)
        owner_uuid = auth_session.user_uuid
        print(auth_session)
    except Exception as e:
        print('error session')
        print(vars(e))
        if isinstance(e, HTTPException) and access_token is not None:
            valid_access_token = shipments.verify_access_token(db, shipment_id, access_token)
            if not valid_access_token:
                raise e
        else:
            raise e

    if owner_uuid is not None:
        valid_access_token = shipment_db.access_token == access_token
        if not valid_access_token and shipment_db.owner_uuid != owner_uuid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN
            )

    try: 
        shipment = ShipmentRead.from_orm(shipment_db)
        return shipment
    except Exception as e:
        print(vars(e))
        print('error schema')

@router.patch('/{shipment_id}', response_model=ShipmentRead)
def update_shipment(shipment_id: str, patch: ShipmentUpdate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Update a user's shipment"""
    try:
        owner_uuid = auth_session.user_uuid
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
        print(vars(e))
        if isinstance(e, HTTPException): raise e

@router.delete('/{shipment_id}', response_model=ShipmentRead)
def delete_shipment(shipment_id: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipmentRead:
    """Delete a user's shipment"""
    # TODO don't delete but disable
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        shipments.delete_shipment(db, shipment_db)
        shipment = ShipmentRead.from_orm(shipment_db)
        return shipment
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException): raise e
        # else raise HTTPException...

@router.get('/{shipment_id}/download')
def download_shipment(shipment_id: str, format: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> Response:
    """Download a user's shipment"""
    try:
        owner_uuid = auth_session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException): raise e
        else: raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST
        )

    formats = ['html', 'pdf', 'text']
    format = format.lower()
    if format not in formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='error_invalid_format'
        )

    error = HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail='error_general'
    )

    try:
        html = shipments.generate_html(shipment_db)
    except Exception as e:
        print(vars(e))
        raise error

    content = None

    if format == 'html':
        content = html

    if format == 'pdf':
        try:
            content = templates.html_to_pdf(html)
        except Exception as e:
            print(vars(e))
            raise error

    return Response(
        content=content,
        media_type='application/octet-stream'
    )

# @router.get('/{shipment_id}/test')
# def test(shipment_id: str,
#     auth_session: AuthSession = Depends(auth.auth_session),
#     db: DatabaseSession = Depends(db_session)):
#     try:
#         shipment_db = shipments._read_shipment(db, shipment_id)

#         template = templates.env.get_template('shipment.html')
#         shipment = ShipmentRead.from_orm(shipment_db).dict()

#         html = template.render(shipment=shipment)
#         # pdf = templates.html_to_pdf(html)
#     except Exception as e:
#         print('error')
#         print(vars(e))

#     try:
#         html_file = open('out.html', 'w')
#         html_file.write(html)

#         # pdf_file = open('out.pdf', 'wb')
#         # pdf_file.write(pdf)
#     except Exception as e:
#         print('io error')
#         print(vars(e))
#     finally:
#         html_file.close()
#         # pdf_file.close()