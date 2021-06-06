from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, validator

from schemas.item import ItemRead, ItemCreate

class ShipmentDownload(BaseModel):
    uuid: str
    access_token: str

    pickup_address_long: str
    delivery_address_long: str

    status: str
    currency: str
    total_value: float
    need_packing: bool
    need_insurance: bool
    comments: str
    items: List[ItemRead]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ShipmentRead(BaseModel):
    uuid: str
    owner_uuid: str
    access_token: str

    pickup_address_id: str
    pickup_address_long: str
    pickup_address_short: str
    pickup_date: date

    delivery_address_id: str
    delivery_address_long: str
    delivery_address_short: str

    status: str
    currency: str
    total_value: float
    # services: List[str] = ['packing', 'insurance', ...]
    need_packing: bool
    need_insurance: bool
    comments: str
    items: List[ItemRead]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ShipmentCreate(BaseModel):
    pickup_address_id: str
    pickup_address_short: Optional[str]
    pickup_address_long: Optional[str]
    pickup_date: date

    delivery_address_id: str
    delivery_address_short: Optional[str]
    delivery_address_long: Optional[str]

    status: str
    currency: str
    total_value: float
    need_packing: bool
    need_insurance: bool
    comments: str
    items: List[ItemCreate]

class ShipmentUpdate(BaseModel):
    # pickup_address: Optional[str] = None
    # pickup_date: Optional[date] = None
    # delivery_address: Optional[str] = None
    status: Optional[str] = None
    currency: Optional[str] = None
    total_value: Optional[float] = None
    need_packing: Optional[bool] = None
    need_insurance: Optional[bool] = None
    comments: Optional[str] = None