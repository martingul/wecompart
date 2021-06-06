from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime

class Session(BaseModel):
    uuid: str
    user_uuid: str
    token: Optional[Any]
    expires_in: Optional[datetime]

    created_at: datetime
    # TODO make updated_at Optional for every schema and set exclude_unset from response
    updated_at: datetime

    class Config:
        orm_mode = True
        
class SessionRead(BaseModel):
    session: str
    expires_in: Optional[datetime]
    created_at: datetime

class Credentials(BaseModel):
    username: str
    password: str
