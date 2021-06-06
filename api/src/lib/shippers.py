import csv
from typing import List, Any
from datetime import datetime
from storage import DatabaseSession
from schemas.shipper import ShipperCreate, ShipperUpdate
from models.shipper import Shipper

def load_shippers(db: DatabaseSession) -> None:
    with open('./shippers.csv') as csv_file:
        reader = csv.reader(csv_file, delimiter=',', quotechar='"')
        next(reader)
        for row in reader:
            emails = [e.strip().lower() for e in row[0].split('/')]
            name = row[1]
            country = row[2]
            shipper_db = create_shipper(db, ShipperCreate(
                email_domain='', emails=emails, country=country, name=name
            ))

def load_email_domains(db: DatabaseSession, shippers_db: List[Shipper]) -> None:
    for s in shippers_db:
        if not s.email_domain and s.emails:
            emails = s.emails.split(',')
            s.email_domain = emails[0].split('@')[1]
    db.commit()

def create_shipper(db: DatabaseSession, shipper: ShipperCreate):
    shipper_db = Shipper(**shipper.dict())
    db.add(shipper_db)
    db.commit()
    db.refresh(shipper_db)
    return shipper_db

def read_shippers(db: DatabaseSession, skip: int = 0, limit: int = 100):
    return db.query(Shipper).offset(skip).limit(limit).all()

def read_shipper(db: DatabaseSession, index: Any, by: str = 'uuid'):
    return db.query(Shipper).filter(getattr(Shipper, by) == index).first()

def update_shipper(db: DatabaseSession, shipper: Shipper, patch: ShipperUpdate):
    for field, value in patch:
        if value is not None:
            setattr(shipper, field, value)
    shipper.updated_at = datetime.now()
    db.commit()
    db.refresh(shipper)
    return shipper

def delete_shipper(db: DatabaseSession, shipper: Shipper):
    db.delete(shipper)
    db.commit()
    return shipper
