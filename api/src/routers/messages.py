from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pandas import Series

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.message import MessageRead, MessageCreate
from schemas.notification import NotificationRead, NotificationCreate
from lib import auth, users, messages, notifications
from lib.websockets import websocket_manager

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
        messages_grouped = messages_series.groupby(keys).apply(list)
                
        # FIXME return a list and not a dictionary (better perf as we need to iterate)
        return messages_grouped.to_dict()
    except Exception as e:
        print(e)
        if isinstance(e, HTTPException):
            raise e 

@router.post('/', response_model=MessageRead,
    status_code=status.HTTP_201_CREATED)
async def create_message(message: MessageCreate,
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
            message_new = MessageRead.from_orm(message_db)
            # TODO notify dst_user if they are online, else create notification

            notification_new = NotificationCreate(
                user_uuid=message_new.dst_user_uuid,
                type='new_message',
                content=message_new.json()
            )

            notification_db = notifications.create_notification(db, notification_new)
            notification = NotificationRead.from_orm(notification_db)

            dst_conn = websocket_manager.get_connection(message_new.dst_user_uuid)
            if dst_conn:
                dst_conn = dst_conn[0]
                await websocket_manager.send_message(dst_conn, notification.json())
            
            return message_new
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        print(e)
        raise e
