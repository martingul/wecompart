import requests

from src.schemas.user import UserRead, UserCreate, UserRole
import lib

endpoint = f'{lib.api_root}/users/'

def random_user():
    return UserCreate(
        fullname=lib.fake.name(),
        username=lib.fake.email(),
        password='password',
        role=UserRole.standard
    )

def test_create_user():
    user_create = random_user()
    response = requests.post(endpoint, json=user_create.dict())
    assert response.status_code == requests.codes.created
    UserRead.parse_obj(response.json())

def test_create_user_username_taken():
    user_create = random_user()
    response = requests.post(endpoint, json=user_create.dict())
    if response.status_code == requests.codes.created:
        response = requests.post(endpoint, json=user_create.dict())
    error_json = response.json()
    assert error_json['detail'] and error_json['detail'] == 'error_username_taken'
    
if __name__ == '__main__':
    test_create_user()