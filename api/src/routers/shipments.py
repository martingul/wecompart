from typing import List, Optional
from fastapi import APIRouter, Header, Response, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.shipment import ShipmentRead, ShipmentCreate, ShipmentUpdate
from lib import auth, shipments, shippers, users, maps

router = APIRouter()

@router.get('/locations')
def read_locations(
    q: str,
    session: Session = Depends(auth.auth_session)
):
    # TODO validate query
    return shipments.read_locations(q)

@router.get('/locations/{location_id}')
def read_location(
    location_id: str,
    session: Session = Depends(auth.auth_session)
):
    # TODO validate query
    return shipments.read_location(location_id)

@router.get('/', response_model=List[ShipmentRead])
def read_shipments(skip: int = 0, limit: int = 100,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[ShipmentRead]:
    """Read all shipments of a user"""
    try:
        owner_uuid = session.user_uuid
        shipments_db = shipments.read_shipments(db, owner_uuid, skip=skip, limit=limit)
        shipments_list = [ShipmentRead.from_orm(i) for i in shipments_db]
        return shipments_list
    except Exception as e:
        print(vars(e))
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

        pickup_location = shipments.read_location(shipment.pickup_address_id)
        shipment.pickup_address_long = pickup_location['long']
        shipment.pickup_address_short = pickup_location['short']

        delivery_location = shipments.read_location(shipment.delivery_address_id)
        shipment.delivery_address_long = delivery_location['long']
        shipment.delivery_address_short = delivery_location['short']

        shipment.country = pickup_location['country'] # or delivery_location?
        candidate_shippers = shippers.read_candidate_shippers(db, shipment.country)
        # TODO send to shipper.emails and notify each user with same email domain

        shipment.access_token = auth.generate_token()

        shipment_new_db = shipments.create_shipment(db, shipment, owner_uuid)
        shipment_new = ShipmentRead.from_orm(shipment_new_db)
        return shipment_new
    except Exception as e:
        print(vars(e))
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
        if shipment_db.owner_uuid != user_uuid and shipment.quotes:
            user_quotes = [q for q in shipment.quotes if q.owner_uuid == user_uuid]
            shipment.quotes = [shipment.quotes[0]] + user_quotes

        shipment.map_url = maps.generate_map_url([
            shipment.pickup_address_long,
            shipment.delivery_address_long
        ])

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
        print(vars(e))
        if isinstance(e, HTTPException): raise e

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
        if isinstance(e, HTTPException): raise e
        # else raise HTTPException...

# @router.get('/{shipment_id}/download')
# def download_shipment(shipment_id: str, format: str,
#     session: Session = Depends(auth.auth_session),
#     db: DatabaseSession = Depends(db_session)) -> Response:
#     """Download a user's shipment"""
#     try:
#         owner_uuid = session.user_uuid
#         shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

#         if shipment_db is None:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail='error_shipment_not_found'
#             )
#     except Exception as e:
#         print(vars(e))
#         if isinstance(e, HTTPException): raise e
#         else: raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST
#         )

#     formats = ['html', 'pdf', 'text']
#     format = format.lower()
#     if format not in formats:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail='error_invalid_format'
#         )

#     error = HTTPException(
#         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         detail='error_general'
#     )

#     try:
#         html = shipments.generate_html(shipment_db)
#     except Exception as e:
#         print(vars(e))
#         raise error

#     content = None

#     if format == 'html':
#         content = html

#     if format == 'pdf':
#         try:
#             content = templates.html_to_pdf(html)
#         except Exception as e:
#             print(vars(e))
#             raise error

#     return Response(
#         content=content,
#         media_type='application/octet-stream'
#    )

# @router.get('/{shipment_id}/test')
# def test(shipment_id: str,
#     session: AuthSession = Depends(auth.auth_session),
#     db: DatabaseSession = Depends(db_session)):
#     try:
#         shipment_db = shipments.read_shipment(db, shipment_id)

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