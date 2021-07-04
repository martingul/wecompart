from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.notification import NotificationRead, NotificationCreate, NotificationUpdate
from lib import auth, users, notifications

router = APIRouter()

@router.post('/', response_model=NotificationRead,
    status_code=status.HTTP_201_CREATED)
def create_notification(notification: NotificationCreate,
    session: Session = Depends(auth.auth_session),
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
def read_notifications(session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[NotificationRead]:
    """Read notifications"""
    try:
        user_db = users.read_user(db, index=session.user_uuid, by='uuid')
        notifications_db = [NotificationRead.from_orm(x) for x in user_db.notifications.limit(5)]
        return notifications_db
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='error_invalid_notification'
        )

@router.patch('/{notification_id}', response_model=NotificationRead)
def update_notification(notification_id: str, patch: NotificationUpdate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> NotificationRead:
    """Update a notification"""
    try:
        user_uuid = session.user_uuid
        notification_db = notifications.read_notification(db, notification_id)

        if notification_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_notification_not_found'
            )

        if notification_db.user_uuid != user_uuid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

        notification_db = notifications.update_notification(db, notification_db, patch)
        notification = NotificationRead.from_orm(notification_db)
        return notification
    except Exception as e:
        print(vars(e))
        if isinstance(e, HTTPException): raise e

# TODO (admin)
# def read_notification
# def update_notification
# def delete_notification