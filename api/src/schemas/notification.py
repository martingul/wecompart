from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class NotificationRead(BaseModel):
    uuid: str
    user_uuid: str
    type: str
    content: str
    read: bool

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class NotificationCreate(BaseModel):
    user_uuid: str
    type: str
    content: str

class NotificationUpdate(BaseModel):
    content: Optional[str] = None
    read: Optional[bool] = None