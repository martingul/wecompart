from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import force_auto_coercion
from uuid import uuid4
from datetime import datetime
import base58

def generate_uuid():
    return base58.b58encode(uuid4().bytes).decode('ascii')

class Entity(object):
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, default=generate_uuid, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(DateTime, default=datetime.now, nullable=False)

force_auto_coercion()
Base = declarative_base()