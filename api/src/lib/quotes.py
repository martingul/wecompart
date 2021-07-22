import stripe
import requests
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from stripe.api_resources import application_fee
from error import ApiError

from storage import DatabaseSession
from schemas.quote import QuoteStripe, QuoteCreate, QuoteRead, QuoteUpdate, QuoteStatus
from models.quote import Quote
from lib import bids

def create_quote(db: DatabaseSession, quote: QuoteCreate, owner_uuid: str,
    account_id: str, customer_id: str):
    # TODO make this a transaction
    try:
        _bids = quote.bids
        del quote.bids

        quote_db = Quote(
            owner_uuid=owner_uuid,
            **quote.dict()
        )

        db.add(quote_db)
        db.commit()
        db.refresh(quote_db)

        for bid in _bids:
            bid.quote_uuid = quote_db.uuid
            bids.create_bid(db, bid)
        
        # TODO possibly add metadata
        quote_stripe = stripe.Quote.create(
            # on_behalf_of=account_id,
            customer=customer_id,
            line_items=[{'price': bid.stripe_price_id} for bid in quote_db.bids]
        )
        quote_db.stripe_quote_id = quote_stripe['id']

        db.commit()
        db.refresh(quote_db)

        stripe.Quote.finalize_quote(quote_db.stripe_quote_id)

        return quote_db
    except Exception as e:
        db.rollback()
        print(e)
        if isinstance(e, IntegrityError):
            detail = 'error_max_quote_reached'
        else:
            detail = 'error_general'
        raise ApiError(detail)

def read_quote(db: DatabaseSession, quote_uuid: str, shipment_uuid: str):
    return db.query(Quote).filter(Quote.uuid == quote_uuid,
        Quote.shipment_uuid == shipment_uuid).first()

def _read_quote(db: DatabaseSession, quote_uuid: str):
    return db.query(Quote).filter(Quote.uuid == quote_uuid).first()

def read_stripe_quote(quote: Quote) -> QuoteStripe:
    quote_stripe =  stripe.Quote.retrieve(
        quote.stripe_quote_id,
        expand=['invoice']
    )
    _quote_stripe = QuoteStripe()
    if quote_stripe['number']:
        _quote_stripe.stripe_quote_number = quote_stripe['number']

    if quote_stripe['invoice']:
        if quote_stripe['invoice']['paid'] is not None:
            _quote_stripe.stripe_paid = quote_stripe['invoice']['paid']
        if quote_stripe['invoice']['number']:
            _quote_stripe.stripe_invoice_number = quote_stripe['invoice']['number']
        if quote_stripe['invoice']['hosted_invoice_url']:
            _quote_stripe.stripe_invoice_url = quote_stripe['invoice']['hosted_invoice_url']
        if quote_stripe['invoice']['invoice_pdf']:
            _quote_stripe.stripe_invoice_pdf = quote_stripe['invoice']['invoice_pdf']
    return _quote_stripe

def update_quote(db: DatabaseSession, quote: Quote, patch: QuoteUpdate) -> QuoteRead:
    for field, value in patch:
        if value is not None:
            setattr(quote, field, value)
    quote.updated_at = datetime.now()
    db.commit()
    db.refresh(quote)
    return quote

def delete_quote(db: DatabaseSession, quote: Quote):
    db.delete(quote)
    db.commit()
    return quote

def accept_quote(quote: Quote):
    quote_stripe = stripe.Quote.accept(quote.stripe_quote_id)
    invoice = stripe.Invoice.finalize_invoice(quote_stripe['invoice'])
    return invoice['hosted_invoice_url']

def release_quote(quote: Quote):
    try:
        total = sum([bid.amount for bid in quote.bids])
        
        invoice_id = stripe.Quote.retrieve(quote.stripe_quote_id)['invoice']
        invoice = stripe.Invoice.retrieve(invoice_id)
        # TODO make sure everything is finalized and charge exists

        transfer = stripe.Transfer.create(
            amount=total,
            currency='eur',
            source_transaction=invoice['charge'],
            destination='acct_1JDpAE2cVptRX74P'
        )
        return transfer['id']
    except Exception as e:
        print(e)
        raise e

def download_quote(quote: Quote):
    return stripe.Quote.pdf(quote.stripe_quote_id)