from enum import Enum
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, validator

class QuoteStatus(str, Enum):
    pending = 'pending'
    accepted = 'accepted'
    declined = 'declined'

class QuoteRead(BaseModel):
    uuid: str
    owner_uuid: str
    shipment_uuid: str
    status: QuoteStatus
    bid: float
    delivery_date: date

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class QuoteCreate(BaseModel):
    status: QuoteStatus = QuoteStatus.pending
    bid: float
    delivery_date: str

    @validator('bid')
    def validate_bid(cls, v: float):
        if v < 0:
            raise ValueError('error_invalid_bid')
        return v

    @validator('delivery_date')
    def validate_delivery_date(cls, v: str):
        if not v:
            raise ValueError('error_invalid_delivery_date')
        return v

class QuoteUpdate(BaseModel):
    # bid: Optional[float] = None
    status: Optional[QuoteStatus] = None