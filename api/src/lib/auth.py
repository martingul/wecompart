from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.exc import IntegrityError

import base64
from passlib import pwd

from storage import db_session, DatabaseSession
from models.session import Session
from models.user import User
from schemas.auth import Session as AuthSession, SessionRead
from lib import users

def generate_token():
    return pwd.genword(entropy=72, charset='hex')

def authenticate(
    db: DatabaseSession, username: str, password: str
) -> User:
    user = users.read_user(db, username, by='username')
    if not user:
        return False
    if user.password != password:
        return False
    return user

def parse_authorization(db: DatabaseSession, authorization: str) -> AuthSession:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='error_invalid_session',
        headers={'WWW-Authenticate': 'Bearer'},
    )
    if authorization is None or len(authorization) < 10:
        raise credentials_exception

    if authorization[:7].lower() != 'bearer ':
        raise credentials_exception

    try:
        session_b64 = authorization[7:].strip()
        session_raw = base64.b64decode(str.encode(session_b64)).decode('utf-8')
        session = session_raw.split(':')
        token = session[0]
        user_uuid = session[1]

        if user_uuid is None or token is None:
            raise Exception

        session_db = read_session(db, user_uuid)
    except Exception as e:
        print(e)
        raise credentials_exception

    if session_db is None:
        raise credentials_exception

    if session_db.token != token or session_db.user_uuid != user_uuid:
        raise credentials_exception

    return AuthSession(
        uuid=session_db.uuid,
        user_uuid=session_db.user_uuid,
        created_at=session_db.created_at,
        updated_at=session_db.updated_at
    )

def auth_session(
    authorization: Optional[str] = Header(None),
    db: DatabaseSession = Depends(db_session)
) -> AuthSession:
    enable_auth = True
    if enable_auth:
        return parse_authorization(db, authorization)
    else:
        return AuthSession(
            uuid='XEz4umfsJNLdCbsv4FrABi',
            user_uuid='5h1Xrpud6aJM5zmVSyraq7',
            created_at='2021-02-15 22:04:51.467299',
            updated_at='2021-02-15 22:04:51.467299'
        )

def create_session(
    db: DatabaseSession, user_uuid: str, expires_in = None
) -> SessionRead:
    """Create a new session for the given user"""
    # TODO check warning about entropy pool
    # https://passlib.readthedocs.io/en/stable/lib/passlib.pwd.html
    token = generate_token()
    session_db = Session(user_uuid=user_uuid)
    session_db.token = token

    try:
        db.add(session_db)
        db.commit()
    except Exception as e:
        db.rollback()

        if (isinstance(e, IntegrityError)):
            session_db_old = read_session(db, user_uuid)
            session_db_old = delete_session(db, session_db_old)
            db.add(session_db)
            db.commit()
        else:
            print(e)
            raise e

    db.refresh(session_db)
    session = AuthSession.from_orm(session_db)
    session.token = token
    return session

def read_session(db: DatabaseSession, user_uuid: str) -> AuthSession:
    """Read a session for the given user"""
    return db.query(Session).filter(Session.user_uuid == user_uuid).first()

def delete_session(db: DatabaseSession, session: Session) -> AuthSession:
    db.delete(session)
    db.commit()
    return session