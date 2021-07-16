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

if __name__ == '__main__':
    test_create_user()