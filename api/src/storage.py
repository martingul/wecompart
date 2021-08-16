from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session as DatabaseSession
from models import base, shipper, user, session, shipment, item, quote,\
    notification, message, service, bid
import config

engine = create_engine(
    f'postgresql://postgres:{config.db_password}'+
    f'@{config.db_host}:{config.db_port}/{config.db_name}',
    echo=True
)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

try:
    base.Base.metadata.create_all(engine)
except Exception as e:
    print(e)

def db_session():
    s: DatabaseSession = Session()
    try:
        yield s
    except:
        s.rollback()
    finally:
        s.close()