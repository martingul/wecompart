import requests

from src.schemas.user import UserRead, UserCreate, UserRole
import utils

endpoint = f'{utils.api_root}/users/'

def random_user(role: UserRole = UserRole.standard):
    return UserCreate(
        fullname=utils.fake.name(),
        username=utils.fake.email(),
        password='password',
        role=role
    )

def test_create_user():
    user_create = random_user()
    response = requests.post(endpoint, json=user_create.dict())
    assert response.status_code == requests.codes.created
    UserRead.parse_obj(response.json())

def test_create_user_shipper_role():
    user_create = random_user(role=UserRole.shipper)
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