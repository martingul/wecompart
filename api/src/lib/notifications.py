from datetime import datetime
from storage import DatabaseSession

from schemas.notification import NotificationRead, NotificationCreate, NotificationUpdate
from models.notification import Notification
from lib.websockets import websocket_manager

def create_notification(db: DatabaseSession, notification: NotificationCreate):
    notification_db = Notification(**notification.dict())
    db.add(notification_db)
    db.commit()
    db.refresh(notification_db)
    return notification_db

def read_notification(db: DatabaseSession, notification_uuid: str):
    return db.query(Notification)\
        .filter(Notification.uuid == notification_uuid).first()

def update_notification(db: DatabaseSession,
    notification: Notification, patch: NotificationUpdate):
    for field, value in patch:
        if value is not None:
            setattr(notification, field, value)
    notification.updated_at = datetime.now()
    db.commit()
    db.refresh(notification)
    return notification

def delete_notification(db: DatabaseSession, notification: Notification):
    db.delete(notification)
    db.commit()
    return notification

async def send_notification(dst_user_uuid: str, notification: NotificationRead):
    dst_conn = websocket_manager.get_connection(dst_user_uuid)
    if dst_conn:
        dst_conn = dst_conn[0]
        await websocket_manager.send_message(dst_conn, notification.json())