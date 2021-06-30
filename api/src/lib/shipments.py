from datetime import datetime
import requests

from storage import DatabaseSession
from schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentDownload
from models.shipment import Shipment
from lib import items
import config

def read_locations(q: str):
    api_url = f'{config.google_places_api_url}autocomplete/json'

    params = {
        'input': q,
        'types': 'address',
        'key': config.credentials.get('google_places_key')
    }

    # TODO handle errors
    try:
        r = requests.get(api_url, params=params)
        predictions = r.json()['predictions'][:5]

        locations = [{'address_id': p['place_id'],
                'address_long': p['description'],
                'address_short': p['structured_formatting']['secondary_text']}
                for p in predictions]
    except Exception as e:
        print('error read_locations')
        print(vars(e))

    return locations

def read_location(id: str):
    api_url = f'{config.google_places_api_url}details/json'
    key = config.credentials.get('google_places_key')

    # TODO handle errors
    res = requests.get(api_url, params={'place_id': id, 'key': key})
    res_json = res.json()
    r = res_json['result']

    print(r)

    city = list(filter(lambda x: any(t in x['types'] for t in ['postal_town', 'locality', 'administrative_area_level_3']), r['address_components']))
    if len(city) > 0:
        city = city[0]['long_name']
    else:
        city = list(filter(lambda x: any(t in x['types'] for t in ['administrative_area_level_2']), r['address_components']))
        if len(city) > 0:
            city = city[0]['long_name']

    country = list(filter(lambda x: any(t in x['types'] for t in ['country']), r['address_components']))
    country_long = ''
    country_short = ''
    if len(country) > 0:
        country_long = country[0]['long_name']
        country_short = country[0]['short_name']

    location_long = r['formatted_address']
    location_short = f'{city}, {country_short}'

    return {
        'long': location_long,
        'short': location_short,
        'country': country_long}

def create_shipment(db: DatabaseSession, shipment: ShipmentCreate, owner_uuid: str):
    _items = shipment.items or []
    del shipment.items

    shipment_db = Shipment(
        owner_uuid=owner_uuid,
        **shipment.dict()
    )

    db.add(shipment_db)
    db.commit()
    db.refresh(shipment_db)

    for item in _items:
        items.create_item(db, item, owner_uuid, shipment_db.uuid)

    return shipment_db

def read_shipments(db: DatabaseSession, owner_uuid: str, skip: int = 0, limit: int = 100):
    return db.query(Shipment).filter(Shipment.owner_uuid == owner_uuid)\
        .offset(skip).limit(limit).all()

def read_shipment(db: DatabaseSession, uuid: str, owner_uuid: str):
    return db.query(Shipment).filter(Shipment.uuid == uuid,
        Shipment.owner_uuid == owner_uuid).first()

def _read_shipment(db: DatabaseSession, uuid: str):
    return db.query(Shipment).filter(Shipment.uuid == uuid).first()

def update_shipment(db: DatabaseSession, shipment: Shipment, patch: ShipmentUpdate):
    for field, value in patch:
        if value is not None:
            setattr(shipment, field, value)
    shipment.updated_at = datetime.now()
    db.commit()
    db.refresh(shipment)
    return shipment

def delete_shipment(db: DatabaseSession, shipment: Shipment):
    db.delete(shipment)
    db.commit()
    return shipment

def verify_access_token(db: DatabaseSession, uuid: str, access_token: str):
    shipment_db = _read_shipment(db, uuid)
    return shipment_db.access_token == access_token.strip().lower()

# def generate_html(shipment_db):
#     html = None
#     try:
#         template = templates.env.get_template('shipment.html')
#         shipment = ShipmentDownload.from_orm(shipment_db).dict()
#         html = template.render(shipment=shipment)
#     except Exception as e:
#         print(vars(e))
#         raise e

#     if html: return html