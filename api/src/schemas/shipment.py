from enum import Enum
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, validator

from .item import ItemRead, ItemCreate
from .quote import QuoteRead
from .service import ServiceRead, ServiceCreate

class ShipmentStatus(str, Enum):
    draft = 'draft'
    pending = 'pending'

class ShipmentRead(BaseModel):
    uuid: str
    owner_uuid: str
    access_token: str # maybe do not return this
    pickup_date: date
    pickup_address_id: str
    pickup_address_long: str
    pickup_address_short: str
    delivery_address_id: str
    delivery_address_long: str
    delivery_address_short: str
    map_url: str
    # country: str
    status: ShipmentStatus
    currency: str
    total_value: float
    comments: str

    items: list[ItemRead]
    services: list[ServiceRead]
    quotes: list[QuoteRead] # should not be accessible by other users than owner

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ShipmentCreate(BaseModel):
    access_token: Optional[str]
    pickup_date: date
    pickup_address_id: str
    pickup_address_short: Optional[str]
    pickup_address_long: Optional[str]
    delivery_address_id: str
    delivery_address_short: Optional[str]
    delivery_address_long: Optional[str]
    map_url: Optional[str]
    country: Optional[str]
    status: ShipmentStatus
    currency: str
    total_value: float
    comments: str

    items: list[ItemCreate]
    services: list[ServiceCreate]

class ShipmentUpdate(BaseModel):
    # pickup_address: Optional[str] = None
    # pickup_date: Optional[date] = None
    # delivery_address: Optional[str] = None
    status: Optional[ShipmentStatus] = None
    currency: Optional[str] = None
    total_value: Optional[float] = None
    services: Optional[list[str]] = None
    comments: Optional[str] = None