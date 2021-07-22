import pytest

from src.schemas.session import SessionEncoded
from src.schemas.user import UserCredentials
import utils

@pytest.fixture
def auth():
    endpoint = f'{utils.api_root}/auth/'
    credentials = UserCredentials(
        username='test@test.test',
        password='password'
    )
    response = utils.session.post(endpoint, json=credentials.dict())
    SessionEncoded.parse_obj(response.json())