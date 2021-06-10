from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session as DatabaseSession
from models import base, shipper, user, session, shipment, item, quote, notification
import config

engine = create_engine(
    f'sqlite:///./{config.credentials.get("db_name")}.db',
    connect_args={"check_same_thread": False}, echo=True
)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
base.Base.metadata.create_all(engine)

def db_session():
    s: DatabaseSession = Session()
    try:
        yield s
    except:
        s.rollback()
    finally:
        s.close()