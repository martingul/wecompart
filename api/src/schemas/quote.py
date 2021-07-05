from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, validator

quote_statuses = ['pending', 'accepted', 'declined']

class QuoteRead(BaseModel):
    uuid: str
    owner_uuid: str
    shipment_uuid: str
    status: str
    price: float
    delivery_date: date

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class QuoteCreate(BaseModel):
    status: str = 'pending'
    price: float
    delivery_date: str

class QuoteUpdate(BaseModel):
    # price: Optional[float] = None
    status: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v not in quote_statuses:
            raise ValueError('error_invalid_quote_status')
        return v