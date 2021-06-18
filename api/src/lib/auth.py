from typing import Optional
from fastapi import Depends, Header, Cookie, Query, HTTPException, status

import base64
from passlib import pwd

# wrote here to prevent circular reference from lib.sessions
def generate_token():
    return pwd.genword(entropy=72, charset='hex')

from storage import db_session, DatabaseSession
from models.user import User
from schemas.session import Session
from schemas.user import UserCredentials, UserRead
from lib import users, sessions

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail='error_invalid_session',
    headers={'WWW-Authenticate': 'Bearer'},
)

# def parse_cookie(cookie: str): # maybe change type to Cookie

def parse_session(session: str):
    try:
        session_b64 = session.strip()
        session_raw = base64.b64decode(str.encode(session_b64)).decode('utf-8')
        session_decoded = session_raw.split(':')

        token = session_decoded[0]
        user_uuid = session_decoded[1]

        if user_uuid is None or token is None:
            raise Exception
    except Exception as e:
        raise credentials_exception
    return token, user_uuid

def parse_header(header: str): # maybe change type to Header
    if header is None or len(header) < 10:
        raise credentials_exception

    if header[:7].lower() != 'bearer ':
        raise credentials_exception

    try:
        session_b64 = header[7:].strip()
        session_raw = base64.b64decode(str.encode(session_b64)).decode('utf-8')
        session_decoded = session_raw.split(':')

        token = session_decoded[0]
        user_uuid = session_decoded[1]

        if user_uuid is None or token is None:
            raise Exception
    except Exception:
        raise credentials_exception
    return token, user_uuid

# TODO add Cookie and token (Query) validation
def auth_session(
    session: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None),
    key: Optional[str] = Query(None),
    db: DatabaseSession = Depends(db_session)) -> Session:
    if session:
        token, user_uuid = parse_session(session)
    elif authorization:
        token, user_uuid = parse_header(authorization)
    elif key:
        token, user_uuid = parse_session(key)

    try:
        s = sessions.validate_session(db, token, user_uuid)
    except Exception:
        raise credentials_exception

    # print(vars(s.user))

    return Session(
        uuid=s.uuid,
        user=UserRead.from_orm(s.user),
        user_uuid=s.user_uuid,
        created_at=s.created_at,
        updated_at=s.updated_at
    )

def authenticate(db: DatabaseSession, credentials: UserCredentials) -> User:
    user = users.read_user(db, credentials.username, by='username')
    if not user:
        return False
    if user.password != credentials.password:
        return False
    return user