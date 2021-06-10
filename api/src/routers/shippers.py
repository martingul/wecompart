from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.auth import Session as AuthSession
from schemas.shipper import ShipperRead, ShipperCreate, ShipperUpdate
from lib import auth, shippers

router = APIRouter()

# TODO write middleware that checks if user has required role

# @router.post('/load', status_code=status.HTTP_201_CREATED)
# def load_shippers(auth_session: AuthSession = Depends(auth.auth_session),
#     db: DatabaseSession = Depends(db_session)) -> None:
#     """Load shippers"""
#     try:
#         shippers.load_shippers(db)
#     except Exception as e:
#         print(e)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail='error_general'
#         )

@router.get('/', response_model=List[ShipperRead])
def read_shippers(skip: int = 0, limit: int = 100,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[ShipperRead]:
    """Read shippers"""
    try:
        # shippers.load_shippers(db)
        shippers_db = shippers.read_shippers(db, skip=skip, limit=limit)
        # shippers.load_email_domains(db, shippers_db)
        shippers_list = [ShipperRead.from_orm(i) for i in shippers_db]
        return shippers_list
    except Exception as e:
        print(e)
        raise e

@router.post('/', response_model=ShipperRead, status_code=status.HTTP_201_CREATED)
def create_shipper(shipper: ShipperCreate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipperRead:
    """Create a new shipper"""
    try:
        # TODO validate shipper
        shipper_new_db = shippers.create_shipper(db, shipper)
        shipper_new = ShipperRead.from_orm(shipper_new_db)
        return shipper_new
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='error_invalid_shipper'
        )

@router.get('/{shipper_id}', response_model=ShipperRead)
def read_shipper(shipper_id: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipperRead:
    """Read a shipper"""
    try:
        shipper_db = shippers.read_shipper(db, shipper_id)

        if shipper_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipper_not_found'
            )
            
        shipper = ShipperRead.from_orm(shipper_db)
        return shipper
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException): raise e

@router.patch('/{shipper_id}', response_model=ShipperRead)
def update_shipper(shipper_id: str, patch: ShipperUpdate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipperRead:
    """Update a shipper"""
    try:
        shipper_db = shippers.read_shipper(db, shipper_id)

        if shipper_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipper_not_found'
            )

        shipper_db = shippers.update_shipper(db, shipper_db, patch)
        shipper = ShipperRead.from_orm(shipper_db)
        return shipper
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException): raise e

@router.delete('/{shipper_id}', response_model=ShipperRead)
def delete_shipper(shipper_id: str,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ShipperRead:
    """Delete a shipper"""
    # TODO don't delete but disable
    try:
        owner_uuid = auth_session.user_uuid
        shipper_db = shippers.read_shipper(db, shipper_id)

        if shipper_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipper_not_found'
            )

        shippers.delete_shipper(db, shipper_db)
        shipper = ShipperRead.from_orm(shipper_db)
        return shipper
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException): raise e