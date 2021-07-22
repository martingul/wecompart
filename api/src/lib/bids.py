import stripe

from schemas.bid import BidCreate
from storage import DatabaseSession
from models.bid import Bid

def create_bid(db: DatabaseSession, bid: BidCreate):
    try:
        bid_db = Bid(
            **bid.dict()
        )
        db.add(bid_db)
        db.commit()
        db.refresh(bid_db)

        price_stripe = stripe.Price.create(
            unit_amount=bid_db.amount,
            currency='eur',
            product=bid_db.service.stripe_product_id
        )
        bid_db.stripe_price_id = price_stripe['id']

        db.commit()
        db.refresh(bid_db)

        return bid_db
    except Exception as e:
        print(e)
        raise e