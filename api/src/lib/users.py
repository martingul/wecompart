import stripe
from typing import  Any
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from storage import DatabaseSession
from schemas.user import UserRead, UserCreate, UserUpdate
from models.user import User
from lib import shippers
from error import ApiError

def create_user(db: DatabaseSession, user: UserCreate):
    try:
        # TODO rewrite it so there is no need to specify every field
        user_db = User(**user.dict())
        user_db.password = user.password

        email_domain = user.username.split('@')[1]
        shipper_db = shippers.read_shipper(db, index=email_domain, by='email_domain')
        if shipper_db:
            user_db.shipper_uuid = shipper_db.uuid
            user_db.role = 'shipper'

        db.add(user_db)
        db.commit()
        db.refresh(user_db)

        return UserRead.from_orm(user_db)
    except Exception as e:
        db.rollback()
        print(e)
        if isinstance(e, IntegrityError):
            detail = 'error_username_taken'
        else:
            detail = 'error_general'
        raise ApiError(detail)

def read_users(db: DatabaseSession, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def read_user(db: DatabaseSession, index: Any, by: str = 'id'):
    return db.query(User).filter(getattr(User, by) == index).first()

def update_user(db: DatabaseSession, user: User, patch: UserUpdate):
    try:
        # TODO handle role update, right now any user can update its role
        for field, value in patch:
            if value is not None:
                setattr(user, field, value)
        user.updated_at = datetime.now()
        db.commit()
        db.refresh(user)

        return user
    except Exception as e:
        db.rollback()
        if isinstance(e, IntegrityError):
            detail = 'error_username_taken'
        else:
            detail = 'error_general'
        raise ApiError(detail)

def delete_user(db: DatabaseSession, user: User):
    # TODO try-except
    db.delete(user)
    db.commit()
    return user

def create_stripe_account(country: str, email: str):
    # TODO move this call on frontend with collected info
    try:
        account_details = {
            'tos_shown_and_accepted': True
        }
        account_token = stripe.Token.create(account=account_details)
        capabilities = {
            'transfers': {
                'requested': True
            },
            'card_payments': {
                'requested': True
            }
        }
        business_profile = {
            # full list: https://stripe.com/docs/connect/setting-mcc#list
            # MCC could also be:
            # - "Motor Freight Carriers and Trucking - Local and Long Distance,
            #   Moving and Storage Companies, and Local Delivery Services"
            #   `motor_freight_carriers_and_trucking` (4214)
            # - "Airlines, Air Carriers"
            #   `airlines_air_carriers` (4511)
            # MCC currently is:
            # "Transportation Services (Not Elsewhere Classified)"
            # `transportation_services` (4789)
            'mcc': '4789'
        }
        account = stripe.Account.create(
            type='custom',
            country=country,
            email=email,
            capabilities=capabilities,
            account_token=account_token,
            business_profile=business_profile
        )
        return account['id']
    except Exception as e:
        print(e)
        raise e

def create_stripe_account_link(account_id: str) -> str:
    try:
        account_link = stripe.AccountLink.create(
            account=account_id,
            refresh_url='http://localhost:8080/#!/',
            return_url='http://localhost:8080/#!/',
            type='account_onboarding',
            collect='currently_due',
        )
        print(account_link)
        return account_link['url']
    except Exception as e:
        print(e)
        raise e

def create_stripe_customer(name: str, email: str) -> str:
    try:
        customer = stripe.Customer.create(
            name=name,
            email=email
        )
        print(customer)
        return customer['id']
    except Exception as e:
        print(e)
        raise e