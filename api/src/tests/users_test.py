import requests

from src.tests import lib
from src.schemas.user import UserRead

def test_create_user():
    user_create = {
        'fullname': lib.fake.name(),
        'username': lib.fake.email(),
        'password': 'password',
        'role': 'standard'
    }
    response = requests.post(f'{lib.api_root}/users', json=user_create)
    assert response.status_code == requests.codes.created
    UserRead.parse_obj(response.json())

def test_create_user_username_taken():
    user_create = {
        'fullname': lib.fake.name(),
        'username': 'test@test.test',
        'password': 'password',
        'role': 'standard'
    }
    response = requests.post(f'{lib.api_root}/users', json=user_create)
    if response.status_code == requests.codes.created:
        response = requests.post(f'{lib.api_root}/users', json=user_create)

    error_json = response.json()
    assert error_json['detail'] and error_json['detail'] == 'error_username_taken'
    

if __name__ == '__main__':
    test_create_user()