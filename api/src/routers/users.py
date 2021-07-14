from typing import List
from fastapi import APIRouter, Request, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from schemas.session import Session
from schemas.user import UserRead, UserCreate, UserUpdate
from lib import auth, users, locations
from error import ApiError

# TODO add permissions (only user itself can modify/access info)

router = APIRouter()

@router.get('/', response_model=List[UserRead])
def read_users(skip: int = 0, limit: int = 100,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> List[UserRead]:
    """Read all users"""
    try:
        users_db = users.read_users(db, skip=skip, limit=limit)
        users_list = [UserRead.from_orm(u) for u in users_db]
        return users_list
    except Exception as e:
        print(e)
        raise e

@router.get('/me', response_model=UserRead)
def read_self(session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> UserRead:
    return read_user(session.user_uuid, session, db)

@router.post('/', status_code=status.HTTP_201_CREATED,
    response_model=UserRead, response_model_exclude_unset=True)
def create_user(user: UserCreate, request: Request,
    db: DatabaseSession = Depends(db_session)) -> UserRead:
    """Create a new user"""
    try:
        #  user.ip_address = request.client.host
        user.ip_address = '8.8.8.8'

        location = locations.get_location_from_ip_address(user.ip_address)
        user.currency = location['currency']
        user.country = location['country']
        user.country_code = location['country_code']

        user_db = users.create_user(db, user)
        user = UserRead.from_orm(user_db)
        return user
    except ApiError as e:
        print(e)
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        if e.detail == 'error_username_taken':
            status_code = status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=status_code, detail=e.detail)
    except Exception as e:
        print(e)

@router.get('/{user_id}', response_model=UserRead)
def read_user(user_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> UserRead:
    """Read a user"""
    try:
        user_db = users.read_user(db, user_id, by='uuid')
    except Exception as e:
        print(e)
        raise e

    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='error_user_not_found'
        )

    try:
        user = UserRead.from_orm(user_db)
    except Exception as e:
        print(e)
        raise e
        
    return user

@router.patch('/{user_id}', response_model=UserRead)
def update_user(user_id: str, patch: UserUpdate,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> UserRead:
    """Update a user"""
    # TODO invalidate access_token after update:
    # check time of latest user update and invalidate if it is greater than
    # the `iat` field of the token
    try:
        user_db = users.read_user(db, user_id, by='uuid')
        if user_db is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_user_not_found'
            )

        user_db = users.update_user(db, user_db, patch)
        user = UserRead.from_orm(user_db)
        return user
    except ApiError as e:
        if e.detail == 'error_username_taken':
            status_code = status.HTTP_400_BAD_REQUEST
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        raise HTTPException(status_code=status_code, detail=e.detail)

@router.delete('/{user_id}', response_model=UserRead)
def delete_user(user_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)) -> UserRead:
    """Delete a user"""
    user_db = users.read_user(db, user_id, by='uuid')
    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='error_user_not_found'
        )

    users.delete_user(db, user_db)
    user = UserRead.from_orm(user_db)
    return user