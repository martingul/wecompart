from enum import Enum
from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel, validator

from .bid import BidRead, BidCreate
from .user import UserRead

class QuoteStatus(str, Enum):
    pending = 'pending'
    accepted = 'accepted'
    declined = 'declined'

class QuoteStripe(BaseModel):
    stripe_quote_number: Optional[str]
    stripe_invoice_number: Optional[str]
    stripe_invoice_url: Optional[str]
    stripe_invoice_pdf: Optional[str]
    stripe_paid: Optional[bool]

class QuoteRead(BaseModel):
    uuid: str
    owner: UserRead
    shipment_uuid: str
    status: QuoteStatus
    delivery_date: date
    # expiration_date: date
    comments: str
    bids: list[BidRead]
    stripe_quote_id: Optional[str]
    stripe_data: Optional[QuoteStripe]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class QuoteCreate(BaseModel):
    shipment_uuid: str
    status: QuoteStatus = QuoteStatus.pending
    delivery_date: str
    comments: str
    stripe_quote_id: Optional[str]
    bids: list[BidCreate]

    @validator('delivery_date')
    def validate_delivery_date(cls, v: str):
        if not v:
            raise ValueError('error_invalid_delivery_date')
        return v

class QuoteUpdate(BaseModel):
    status: Optional[QuoteStatus] = None