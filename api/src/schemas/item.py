from typing import Optional
from datetime import datetime
from pydantic import BaseModel, validator

class ItemRead(BaseModel):
    uuid: str
    owner_uuid: str
    shipment_uuid: str

    description: str
    quantity: int
    dim_unit: str
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
    dim_unit: str
    length: float
    width: float
    height: float
    weight: float

    @validator('dim_unit')
    def validate_dim_unit(cls, v):
        valid_dim_units = ['cm', 'in']
        assert v in valid_dim_units, 'error_invalid_item_dim_unit'
        return v

class ItemUpdate(BaseModel):
    description: Optional[str] = None
    quantity: Optional[int] = None
    dim_unit: Optional[str] = None
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None

    @validator('dim_unit')
    def validate_dim_unit(cls, v):
        valid_dim_units = ['cm', 'in']
        assert v in valid_dim_units, 'error_invalid_item_dim_unit'
        return v

    @validator('quantity')
    def validate_quantity(cls, v):
        assert v > 0, 'error_invalid_item_quantity'
        return v