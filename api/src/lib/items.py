from datetime import datetime
from sqlalchemy.orm import Session

from schemas.item import ItemCreate, ItemUpdate
from models.item import Item

def create_item(db: Session, item: ItemCreate,
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

def read_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Item).offset(skip).limit(limit).all()

def read_item(db: Session, item_uuid: str, shipment_uuid: str):
    return db.query(Item).filter(Item.uuid == item_uuid,
        Item.shipment_uuid == shipment_uuid).first()

def update_item(db: Session, item: Item, patch: ItemUpdate):
    for field, value in patch:
        if value is not None:
            setattr(item, field, value)
    item.updated_at = datetime.now()
    db.commit()
    db.refresh(item)
    return item

def delete_item(db: Session, item: Item):
    db.delete(item)
    db.commit()
    return item