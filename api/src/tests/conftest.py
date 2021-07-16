import pytest

from src.schemas.session import SessionEncoded
import lib

@pytest.fixture
def auth():
    credentials = {
        'username': 'test@test.test',
        'password': 'password'
    }
    response = lib.session.post(f'{lib.api_root}/auth/', json=credentials)
    SessionEncoded.parse_obj(response.json())