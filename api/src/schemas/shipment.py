from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, validator

from schemas.item import ItemRead, ItemCreate
# from schemas.quote import QuoteRead

class ShipmentDownload(BaseModel):
    uuid: str
    access_token: str

    pickup_address_long: str
    delivery_address_long: str

    status: str
    currency: str
    total_value: float
    services: List[str]
    comments: str
    items: List[ItemRead]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ShipmentRead(BaseModel):
    uuid: str
    owner_uuid: str
    access_token: str # maybe do not return this

    pickup_address_id: str
    pickup_address_long: str
    pickup_address_short: str
    pickup_date: date

    delivery_address_id: str
    delivery_address_long: str
    delivery_address_short: str

    # country: str

    status: str
    currency: str
    total_value: float
    comments: str

    services: List[str]
    items: List[ItemRead]
    # quotes: List[QuoteRead] # should not be accessible by other users than owner

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ShipmentCreate(BaseModel):
    access_token: Optional[str]
    
    pickup_address_id: str
    pickup_address_short: Optional[str]
    pickup_address_long: Optional[str]
    pickup_date: date

    delivery_address_id: str
    delivery_address_short: Optional[str]
    delivery_address_long: Optional[str]

    country: Optional[str]

    status: str
    currency: str
    total_value: float
    comments: str

    services: List[str]
    items: List[ItemCreate]

class ShipmentUpdate(BaseModel):
    # pickup_address: Optional[str] = None
    # pickup_date: Optional[date] = None
    # delivery_address: Optional[str] = None
    status: Optional[str] = None
    currency: Optional[str] = None
    total_value: Optional[float] = None
    services: Optional[List[str]] = None
    comments: Optional[str] = None