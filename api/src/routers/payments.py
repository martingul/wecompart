from fastapi import APIRouter, Depends, HTTPException, status
import stripe

from storage import db_session, DatabaseSession
from schemas.session import Session
from lib import auth, quotes, payments

router = APIRouter()

@router.post('/')
def create_payment(quote_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)):
    try:
        quote_db = quotes._read_quote(db, quote_id)
        if not quote_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='error_quote_not_found'
            )

        payment_intent = stripe.PaymentIntent.create(
            amount=int(quote_db.bid) * 100,
            currency='usd',
            payment_method_types=['card'],
            on_behalf_of='acct_1JDpAE2cVptRX74P'
        )
        return {
            'id': payment_intent['id'],
            'secret': payment_intent['client_secret'],
        }
    except Exception as e:
        print(e)

# define as PATCH instead and update payment status
@router.post('/{payment_id}/release')
def release_payment(payment_id: str,
    session: Session = Depends(auth.auth_session),
    db: DatabaseSession = Depends(db_session)):
    try:
        payment_intent = stripe.PaymentIntent.retrieve(payment_id)
        print(payment_intent)

        if payment_intent['charges']['total_count'] > 0:
            source_transaction = payment_intent['charges']['data'][0]

            transfer = stripe.Transfer.create(
                amount=payment_intent['amount'],
                currency='usd',
                source_transaction=source_transaction,
                destination='acct_1JDpAE2cVptRX74P'
            )
            print(transfer)
    except Exception as e:
        print(e)
        raise e