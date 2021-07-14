from typing import Optional
from datetime import datetime
from pydantic import BaseModel, validator
import re

user_roles = ['standard', 'shipper', 'admin']

class UserRead(BaseModel):
    uuid: str
    username: str
    fullname: str
    role: str

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    fullname: str
    username: str
    password: str

    ip_address: Optional[str]
    currency: Optional[str]
    country: Optional[str]
    country_code: Optional[str]

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
                'username': 'example@company.com',
                'fullname': 'John Doe',
                'password': 'example',
            }
        }

class UserUpdate(BaseModel):
    username: Optional[str] = None
    fullname: Optional[str] = None
    role: Optional[str] = None
    password: Optional[str] = None

    @validator('role')
    def verify_role(cls, v: str):
        if v not in user_roles:
            raise ValueError('error_invalid_user_role')
        return v

class UserCredentials(BaseModel):
    username: str
    password: str
