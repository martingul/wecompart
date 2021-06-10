from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.auth import Session as AuthSession
from schemas.notification import NotificationRead, NotificationCreate
from lib import auth, users, notifications

router = APIRouter()

@router.post('/', response_model=NotificationRead,
    status_code=status.HTTP_201_CREATED)
def create_notification(notification: NotificationCreate,
    auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> NotificationRead:
    """Create a new notification"""
    try:
        # TODO validate notification
        # TODO admin only
        notification_new_db = notifications.create_notification(db, notification)
        notification_new = NotificationRead.from_orm(notification_new_db)
        return notification_new
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='error_invalid_notification'
        )

@router.get('/', response_model=List[NotificationRead])
def read_notifications(auth_session: AuthSession = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[NotificationRead]:
    """Read notifications"""
    try:
        user_db = users.read_user(db, index=auth_session.user_uuid, by='uuid')
        notifications_db = [NotificationRead.from_orm(x) for x in user_db.notifications]
        return notifications_db
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='error_invalid_notification'
        )

# TODO
# def read_notification
# def update_notification
# def delete_notification