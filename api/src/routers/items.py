from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.item import ItemRead, ItemCreate, ItemUpdate
from lib import auth, shipments, items

# TODO make sure user requesting these endpoints have the right permissions
# by checking if they own the shipment, or are allowed to read its content

router = APIRouter()

@router.get('/{shipment_id}/items/', response_model=List[ItemRead])
def read_shipment_items(shipment_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[ItemRead]:
    """Read shipment items"""
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)
        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        items_list = [ItemRead.from_orm(x) for x in shipment_db.items]
        return items_list
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException):
            raise e 

@router.post('/{shipment_id}/items/', response_model=ItemRead,
    status_code=status.HTTP_201_CREATED)
def create_shipment_item(shipment_id: str, item: ItemCreate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ItemRead:
    """Create a new shipment item"""
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )
        
        item_new_db = items.create_item(db, item, owner_uuid, shipment_db.uuid)
        item_new = ItemRead.from_orm(item_new_db)
        return item_new
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e

@router.get('/{shipment_id}/items/{item_id}', response_model=ItemRead)
def read_shipment_item(shipment_id: str, item_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ItemRead:
    """Read a shipment item"""
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)
        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        item_db = [x for x in shipment_db.items if x.uuid == item_id]
        # item_db = items.read_item(db, item_id, shipment_db.uuid)
        if not item_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_item_not_found'
            )

        item = ItemRead.from_orm(item_db[0])
        return item
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e

@router.patch('/{shipment_id}/items/{item_id}', response_model=ItemRead)
def update_shipment_item(shipment_id: str, item_id: str, patch: ItemUpdate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ItemRead:
    """Update a shipment item"""
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        item_db = items.read_item(db, item_id, shipment_db.uuid)
        if item_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_item_not_found'
            )

        item_db = items.update_item(db, item_db, patch)
        item = ItemRead.from_orm(item_db)
        return item
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e

@router.delete('/{shipment_id}/items/{item_id}', response_model=ItemRead)
def delete_shipment_item(shipment_id: str, item_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> ItemRead:
    """Delete a shipment item"""
    try:
        owner_uuid = session.user_uuid
        shipment_db = shipments.read_shipment(db, shipment_id, owner_uuid)

        if shipment_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_shipment_not_found'
            )

        item_db = items.read_item(db, item_id, shipment_db.uuid)
        if item_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_item_not_found'
            )

        items.delete_item(db, item_db)
        item = ItemRead.from_orm(item_db)
        return item
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException):
            raise e