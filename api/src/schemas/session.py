from typing import Optional
from pydantic import BaseModel
from datetime import datetime

from .user import UserRead

class Session(BaseModel):
    uuid: str
    user: UserRead
    user_uuid: str
    expires_in: Optional[datetime]

    created_at: datetime
    # TODO make updated_at Optional for every schema and set exclude_unset from response
    updated_at: datetime

    class Config:
        orm_mode = True

class SessionEncoded(BaseModel):
    session: str
    expires_in: Optional[datetime]
    created_at: datetime