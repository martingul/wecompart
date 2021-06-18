from datetime import datetime
from pydantic import BaseModel

class MessageRead(BaseModel):
    uuid: str
    src_user_uuid: str
    dst_user_uuid: str
    content: str
    read: bool

    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    dst_user_uuid: str
    content: str