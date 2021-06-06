from fastapi import APIRouter, Depends, HTTPException, status
import base64

from storage import db_session, DatabaseSession
from schemas.auth import Credentials, Session, SessionRead
from lib import auth

router = APIRouter()

@router.post('/token',
    status_code=status.HTTP_201_CREATED,
    response_model=SessionRead, response_model_exclude_unset=True)
def token(credentials: Credentials,
    db: DatabaseSession = Depends(db_session)) -> SessionRead:
    """Grant new session token"""
    user = None
    try:
        # TODO validate credentials before checking
        user = auth.authenticate(db, credentials.username, credentials.password)
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
        session: Session = auth.create_session(db, user.uuid)
        session_raw = ':'.join([session.token, session.user_uuid])
        session_b64 = base64.b64encode(str.encode(session_raw)).decode('utf-8')
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='error_general'
        )
        
    return SessionRead(
        session=session_b64,
        expires_in=session.expires_in,
        created_at=session.created_at
    )

@router.get('/echo')
def echo(db: DatabaseSession = Depends(db_session),
    auth_session: Session = Depends(auth.auth_session)
):
    return True