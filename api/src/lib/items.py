from datetime import datetime

from storage import DatabaseSession
from schemas.item import ItemCreate, ItemUpdate
from models.item import Item

def create_item(db: DatabaseSession, item: ItemCreate,
    owner_uuid: str, shipment_uuid: str):
    item_db = Item(
        owner_uuid=owner_uuid,
        shipment_uuid=shipment_uuid,
        **item.dict()
    )

    db.add(item_db)
    db.commit()
    db.refresh(item_db)
    return item_db

def read_items(db: DatabaseSession, skip: int = 0, limit: int = 100):
    return db.query(Item).offset(skip).limit(limit).all()

def read_item(db: DatabaseSession, item_uuid: str, shipment_uuid: str):
    return db.query(Item).filter(Item.uuid == item_uuid,
        Item.shipment_uuid == shipment_uuid).first()

def update_item(db: DatabaseSession, item: Item, patch: ItemUpdate):
    for field, value in patch:
        if value is not None:
            setattr(item, field, value)
    item.updated_at = datetime.now()
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: DatabaseSession, item: Item):
    db.delete(item)
    db.commit()
    return item