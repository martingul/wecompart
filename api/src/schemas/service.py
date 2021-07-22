from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class ServiceRead(BaseModel):
    uuid: str
    name: str
    shipment_uuid: str
    stripe_product_id: Optional[str]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ServiceCreate(BaseModel):
    name: str # maybe from enum
    shipment_uuid: Optional[str]
    stripe_product_id: Optional[str]
