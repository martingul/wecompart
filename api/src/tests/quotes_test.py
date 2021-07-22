import random
import requests

from src.schemas.quote import QuoteRead, QuoteCreate, QuoteStatus
import utils

def random_quote():
    return QuoteCreate(
        status=QuoteStatus.pending,
        bid=random.randint(0, 200),
        delivery_date=utils.random_future_date()
    )

# def test_create_shipment_quote():
#     endpoint = f'{utils.api_root}/shipments/'
#     quote_create = random_quote()
#     response = requests.post(endpoint, json=quote_create.dict())
#     assert response.status_code == requests.codes.created
#     QuoteRead.parse_obj(response.json())