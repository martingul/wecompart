import requests
import random

import utils
from src.schemas.shipment import ShipmentRead, ShipmentCreate
from src.schemas.service import ServiceCreate
from src.schemas.item import ItemCreate, ItemDimensionUnit

endpoint = f'{utils.api_root}/shipments/'

def random_item():
    return ItemCreate(
        description=utils.fake.sentence(nb_words=4),
        quantity=random.randint(0, 3),
        dim_unit=ItemDimensionUnit.centimeters,
        length=random.randint(0, 200),
        width=random.randint(0, 200),
        height=random.randint(0, 200),
        weight=random.randint(0, 200)
    )

def random_shipment():
    return ShipmentCreate(
        status='pending',
        pickup_address_id='Eh5BYXJvbiBXYXksIFNhY3JhbWVudG8sIENBLCBVU0EiLiosChQKEgkHOGe4zM-agBGNYlLpRUPwExIUChIJ-ZeDsnLGmoAR238ZdKpqH5I',
        delivery_address_id='ChIJjbwJqKEphYARL1UEX5jKIy8',
        pickup_date=utils.random_future_date(),
        currency='usd',
        total_value=random.randint(0, 10000),
        comments=utils.fake.sentence(nb_words=10),
        services=[
            ServiceCreate(name='packaging'),
            ServiceCreate(name='insurance')
        ],
        items=[random_item() for _ in range(random.randint(1, 5))],
    )

def test_create_shipment(auth):
    shipment_create = random_shipment()
    headers = {'content-type': 'application/json'}
    response = utils.session.post(endpoint, headers=headers,
        data=shipment_create.json())
    assert response.status_code == requests.codes.created
    ShipmentRead.parse_obj(response.json())
