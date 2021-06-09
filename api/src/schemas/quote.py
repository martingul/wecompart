from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class QuoteRead(BaseModel):
    uuid: str
    owner_uuid: str
    shipment_uuid: str

    price: float

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class QuoteCreate(BaseModel):
    price: float

class QuoteUpdate(BaseModel):
    price: Optional[float] = None