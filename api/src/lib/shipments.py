from datetime import datetime

from storage import DatabaseSession
from schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentDownload
from models.shipment import Shipment
from lib import items

def create_shipment(db: DatabaseSession, shipment: ShipmentCreate, owner_uuid: str):
    _items = shipment.items or []
    del shipment.items

    shipment_db = Shipment(
        owner_uuid=owner_uuid,
        **shipment.dict()
    )

    db.add(shipment_db)
    db.commit()
    db.refresh(shipment_db)

    for item in _items:
        items.create_item(db, item, owner_uuid, shipment_db.uuid)

    return shipment_db

def read_shipments(db: DatabaseSession, owner_uuid: str, skip: int = 0, limit: int = 100):
    return db.query(Shipment).filter(Shipment.owner_uuid == owner_uuid)\
        .offset(skip).limit(limit).all()

def read_shipment(db: DatabaseSession, uuid: str, owner_uuid: str = None):
    if not owner_uuid:
        return db.query(Shipment).filter(Shipment.uuid == uuid).first()
    else:
        return db.query(Shipment).filter(Shipment.uuid == uuid,
            Shipment.owner_uuid == owner_uuid).first()

def update_shipment(db: DatabaseSession, shipment: Shipment, patch: ShipmentUpdate):
    for field, value in patch:
        if value is not None:
            setattr(shipment, field, value)
    shipment.updated_at = datetime.now()
    db.commit()
    db.refresh(shipment)
    return shipment

def delete_shipment(db: DatabaseSession, shipment: Shipment):
    db.delete(shipment)
    db.commit()
    return shipment

# def generate_html(shipment_db):
#     html = None
#     try:
#         template = templates.env.get_template('shipment.html')
#         shipment = ShipmentDownload.from_orm(shipment_db).dict()
#         html = template.render(shipment=shipment)
#     except Exception as e:
#         print(vars(e))
#         raise e

#     if html: return html