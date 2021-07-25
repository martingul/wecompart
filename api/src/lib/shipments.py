from datetime import datetime

from storage import DatabaseSession
from schemas.shipment import ShipmentCreate, ShipmentUpdate
from models.shipment import Shipment
from lib import items, locations, maps, services

def create_shipment(db: DatabaseSession, shipment: ShipmentCreate, owner_uuid: str):
    _items = shipment.items or []
    _services = shipment.services or []
    del shipment.items
    del shipment.services

    pickup_location = locations.read_location(shipment.pickup_address_id)
    shipment.pickup_address_long = pickup_location['long']
    shipment.pickup_address_short = pickup_location['short']

    delivery_location = locations.read_location(shipment.delivery_address_id)
    shipment.delivery_address_long = delivery_location['long']
    shipment.delivery_address_short = delivery_location['short']

    shipment.map_url = maps.generate_map_url([
        shipment.pickup_address_long,
        shipment.delivery_address_long
    ])

    shipment.country = pickup_location['country'] # or delivery_location?

    shipment_db = Shipment(
        owner_uuid=owner_uuid,
        **shipment.dict()
    )
    db.add(shipment_db)
    db.flush()

    for item in _items:
        # TODO place shipment_uuid in item schema
        items.create_item(db, item, owner_uuid, shipment_db.uuid)

    for service in _services:
        service.shipment_uuid = shipment_db.uuid
        services.create_service(db, service)

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