from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, validator

class ItemDimensionUnit(str, Enum):
    centimeters = 'cm'
    inches = 'in'

class ItemRead(BaseModel):
    uuid: str
    owner_uuid: str
    shipment_uuid: str

    description: str
    quantity: int
    dim_unit: ItemDimensionUnit
    length: float
    width: float
    height: float
    weight: float

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ItemCreate(BaseModel):
    description: str
    quantity: int = 1
    dim_unit: ItemDimensionUnit
    length: float
    width: float
    height: float
    weight: float

class ItemUpdate(BaseModel):
    description: Optional[str] = None
    quantity: Optional[int] = None
    dim_unit: Optional[ItemDimensionUnit] = None
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None

    @validator('quantity')
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError('error_invalid_item_quantity')
        return v