from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, validator

quote_statuses = ['pending', 'accepted', 'declined']

class QuoteRead(BaseModel):
    uuid: str
    owner_uuid: str
    shipment_uuid: str
    status: str
    bid: float
    delivery_date: date

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class QuoteCreate(BaseModel):
    status: str = 'pending'
    bid: float
    delivery_date: str

    @validator('bid')
    def validate_bid(cls, v: float):
        if v < 0:
            raise ValueError('error_invalid_bid')
        return v

    @validator('status')
    def validate_status(cls, v: str):
        if v != 'pending':
            raise ValueError('error_invalid_status')
        return v

    @validator('delivery_date')
    def validate_delivery_date(cls, v: str):
        if not v:
            raise ValueError('error_invalid_delivery_date')
        return v

class QuoteUpdate(BaseModel):
    # bid: Optional[float] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v: str):
        if v not in quote_statuses:
            raise ValueError('error_invalid_status')
        return v