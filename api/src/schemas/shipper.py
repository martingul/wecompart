from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, validator

class ShipperRead(BaseModel):
    uuid: str

    email_domain: str
    emails: Optional[List[str]]
    country: str
    name: Optional[str]

    created_at: datetime
    updated_at: datetime

    @validator('emails', pre=True)
    def validate_emails(cls, v):
        if isinstance(v, str):
            return v.split(',')
        return v

    class Config:
        orm_mode = True

class ShipperCreate(BaseModel):
    email_domain: str
    emails: Optional[List[str]]
    country: str
    name: Optional[str]

    @validator('emails', pre=True)
    def validate_emails(cls, v):
        if isinstance(v, str):
            return v.split(',')
        return v

class ShipperUpdate(BaseModel):
    email_domain: Optional[str] = None
    emails: Optional[List[str]] = None
    country: Optional[str] = None
    name: Optional[str] = None