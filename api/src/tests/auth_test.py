from src.schemas.session import SessionEncoded
import lib

endpoint = f'{lib.api_root}/auth/'

def test_create_session():
    credentials = {
        'username': 'test@test.test',
        'password': 'password'
    }
    response = lib.session.post(endpoint, json=credentials)
    SessionEncoded.parse_obj(response.json())