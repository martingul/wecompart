from datetime import datetime
from storage import DatabaseSession

from schemas.message import MessageCreate
from models.message import Message

def read_user_messages(db: DatabaseSession, user_uuid: str):
    # TODO add skip and offset
    return db.query(Message).filter((Message.src_user_uuid == user_uuid)\
        | (Message.dst_user_uuid == user_uuid)).all()

def create_message(db: DatabaseSession, src_user_uuid: str, message: MessageCreate):
    message_db = Message(src_user_uuid=src_user_uuid, **message.dict())

    db.add(message_db)
    db.commit()
    db.refresh(message_db)
    return message_db

# def read_messages(db: DatabaseSession, skip: int = 0, limit: int = 100):
#     return db.query(Message).offset(skip).limit(limit).all()

# def read_message(db: DatabaseSession, message_uuid: str, shipment_uuid: str):
#     return db.query(Message).filter(Message.uuid == message_uuid,
#         Message.shipment_uuid == shipment_uuid).first()

# def update_message(db: DatabaseSession, message: Message, patch: MessageUpdate):
#     for field, value in patch:
#         if value is not None:
#             setattr(message, field, value)
#     message.updated_at = datetime.now()
#     db.commit()
#     db.refresh(message)
#     return message

# def delete_message(db: DatabaseSession, message: Message):
#     db.delete(message)
#     db.commit()
#     return message