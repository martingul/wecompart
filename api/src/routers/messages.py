from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pandas import Series

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.message import MessageRead, MessageCreate
from lib import auth, users, messages

import pandas as pd

router = APIRouter()

@router.get('/')
def read_messages(session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)):
    try:
        messages_db = messages.read_user_messages(db, session.user.uuid)
        messages_list = [MessageRead.from_orm(x).dict() for x in messages_db]
        keys = []
        
        for m in messages_list:
            if m['src_user_uuid'] != session.user.uuid:
                keys.append(m['src_user_uuid'])
            else:
                keys.append(m['dst_user_uuid'])

        messages_series = Series(messages_list, index=keys)
        messages_grouped = messages_series.groupby(keys).apply(list).to_dict()

        return messages_grouped
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException):
            raise e 

@router.post('/', response_model=MessageRead,
    status_code=status.HTTP_201_CREATED)
def create_message(message: MessageCreate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> MessageRead:
    try:
        src_user_uuid = session.user.uuid
        dst_user_uuid = message.dst_user_uuid

        dst_user_db = users.read_user(db, dst_user_uuid, by='uuid')
        if not dst_user_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_user_not_found'
            )

        src_is_shipper = session.user.role == 'shipper'
        dst_is_shipper = dst_user_db.role == 'shipper'

        # src_is_shipper xor dst_is_shipper, maybe rewrite as bool(a) != bool(b)
        if (src_is_shipper and not dst_is_shipper) or (not src_is_shipper and dst_is_shipper):
            message_db = messages.create_message(db, src_user_uuid, message)
            message = MessageRead.from_orm(message_db)
            # TODO notify dst_user if they are online, else create notification
            return message
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        print(e)
        raise e
