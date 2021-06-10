from datetime import datetime
from sqlalchemy.orm import Session

from schemas.notification import NotificationCreate, NotificationUpdate
from models.notification import Notification

def create_notification(db: Session, notification: NotificationCreate):
    notification_db = Notification(**notification.dict())
    db.add(notification_db)
    db.commit()
    db.refresh(notification_db)
    return notification_db

# def read_notifications(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(Notification).offset(skip).limit(limit).all()

def read_notification(db: Session, notification_uuid: str):
    return db.query(Notification)\
        .filter(Notification.uuid == notification_uuid).first()

def update_notification(db: Session,
    notification: Notification, patch: NotificationUpdate):
    for field, value in patch:
        if value is not None:
            setattr(notification, field, value)
    notification.updated_at = datetime.now()
    db.commit()
    db.refresh(notification)
    return notification

def delete_notification(db: Session, notification: Notification):
    db.delete(notification)
    db.commit()
    return notification