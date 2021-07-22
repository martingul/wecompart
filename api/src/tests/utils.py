import json
import random
import datetime
import requests
from faker import Faker

api_root = 'http://localhost:5000'
fake = Faker()
session = requests.Session()

def random_address():
    f = open('./src/tests/assets/addresses-us-all.min.json')
    addresses = json.load(f)
    addresses = addresses['addresses']
    f.close()
    i = random.randint(0, len(addresses)-1)
    return addresses[i]

def french_address():
    return {
        'address1': '46 Rue du Faubourg des Trois',
        'city': 'Nancy',
        'postalCode': '54000',
        'state': ''
    }

def random_future_date():
    days_in_future = random.randint(0, 30)
    now = datetime.datetime.now()
    future_date = now + datetime.timedelta(days=days_in_future)
    return future_date.strftime('%Y-%m-%d')