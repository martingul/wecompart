from fastapi import APIRouter, Depends, Response, HTTPException, status
import base64

from storage import db_session, DatabaseSession
from schemas.session import Session, SessionEncoded
from schemas.user import UserCredentials
from lib import auth, sessions

router = APIRouter()

@router.post('/',
    status_code=status.HTTP_201_CREATED,
    response_model=SessionEncoded, response_model_exclude_unset=True)
def create_session(credentials: UserCredentials, response: Response,
    db: DatabaseSession = Depends(db_session)) -> SessionEncoded:
    """Create new session"""
    user = None
    try:
        # TODO validate credentials before checking
        user = auth.authenticate(db, credentials)
    except Exception as e:
        print(vars(e))

    if not user:
        # XXX Maybe hash the password anyway before to mitigate against timing
        # attacks for user enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='error_invalid_credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    try:
        session_db, token = sessions.create_session(db, user.uuid)
        session_raw = ':'.join([token, session_db.user_uuid])
        session_b64 = base64.b64encode(str.encode(session_raw)).decode('utf-8')
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='error_general'
        )

    # TODO set as secure and http-only
    response.set_cookie(key='session', value=session_b64)
    
    return SessionEncoded(
        session=session_b64,
        expires_in=session_db.expires_in,
        created_at=session_db.created_at
    )

@router.delete('/')
def delete_session(response: Response,
    db: DatabaseSession = Depends(db_session),
    auth_session: Session = Depends(auth.auth_session)):
    """Delete a session"""
    try:
        session_db = sessions.read_session(db, auth_session.user_uuid)
        sessions.delete_session(db, session_db)
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='error_general'
        )

    response.delete_cookie(key='session')

@router.get('/')
def read_session(db: DatabaseSession = Depends(db_session),
    auth_session: Session = Depends(auth.auth_session)
):
    return True