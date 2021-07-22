from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, validator
import re

class UserRole(str, Enum):
    standard = 'standard'
    shipper = 'shipper'
    admin = 'admin'

class UserRead(BaseModel):
    uuid: str
    fullname: str
    username: str
    role: UserRole
    country_code: Optional[str]
    stripe_customer_id: Optional[str] # maybe do not show that publicly
    stripe_account_id: Optional[str]

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    fullname: str
    username: str
    password: str
    role: UserRole = UserRole.standard
    ip_address: Optional[str]
    currency: Optional[str]
    country: Optional[str]
    country_code: Optional[str]
    stripe_customer_id: Optional[str]
    # stripe_account_id: Optional[str]

    @validator('fullname')
    def validate_fullname(cls, v: str):
        if len(v) < 2:
            raise ValueError('error_invalid_fullname')
        return v

    @validator('username')
    def validate_username(cls, v: str):
        regex = re.compile(
            r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
            re.IGNORECASE
        )
        if not regex.match(v):
            raise ValueError('error_invalid_username')
        return v

    @validator('password')
    def verify_password(cls, v: str):
        if len(v) < 6:
            raise ValueError('error_invalid_password')
        return v 

    class Config:
        schema_extra = {
            'example': {
                'fullname': 'John Doe',
                'username': 'example@company.com',
                'password': 'example',
            }
        }

class UserUpdate(BaseModel):
    username: Optional[str] = None
    fullname: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None

class UserCredentials(BaseModel):
    username: str
    password: str
