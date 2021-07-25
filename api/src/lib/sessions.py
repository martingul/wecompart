from models.session import Session
from sqlalchemy.exc import IntegrityError

from lib.auth import generate_token
from storage import DatabaseSession

def validate_session(db: DatabaseSession, token: str, user_uuid: str):
    session_db = read_session(db, user_uuid)
    if session_db is None or session_db.token != token:
        raise Exception
    return session_db

def create_session(db: DatabaseSession,
    user_uuid: str, expires_in = None):
    """Create a new session for the given user"""
    # TODO check warning about entropy pool
    # https://passlib.readthedocs.io/en/stable/lib/passlib.pwd.html
    token = generate_token()
    session_db = Session(user_uuid=user_uuid)
    session_db.token = token

    try:
        db.add(session_db)
        db.flush()
    except Exception as e:
        db.rollback()

        if (isinstance(e, IntegrityError)):
            session_db_old = read_session(db, user_uuid)
            session_db_old = delete_session(db, session_db_old)
            db.add(session_db)
        else:
            print(e)
            raise e

    db.commit()
    db.refresh(session_db)
    return session_db, token

def read_session(db: DatabaseSession, user_uuid: str):
    """Read a session for the given user"""
    return db.query(Session).filter(Session.user_uuid == user_uuid).first()

def delete_session(db: DatabaseSession, session: Session):
    db.delete(session)
    db.commit()
    return session