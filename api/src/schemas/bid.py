from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from .service import ServiceRead

class BidRead(BaseModel):
    uuid: str
    amount: int
    service: ServiceRead
    stripe_price_id: Optional[str]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class BidCreate(BaseModel):
    amount: int
    service_uuid: str
    quote_uuid: Optional[str]
    stripe_price_id: Optional[str]