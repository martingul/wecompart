import json
import random
import datetime

from faker import Faker
fake = Faker()

api_root = 'http://localhost:5000'

def get_random_address():
    f = open('./src/tests/assets/addresses-us-all.min.json')
    addresses = json.load(f)
    addresses = addresses['addresses']
    f.close()
    i = random.randint(0, len(addresses)-1)
    return addresses[i]

def get_future_date():
    days_in_future = random.randint(0, 30)
    now = datetime.datetime.now()
    future_date = now + datetime.timedelta(days=days_in_future)
    return future_date.strftime('%Y-%m-%d')