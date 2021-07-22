from src.schemas.session import SessionEncoded
from src.schemas.user import UserCredentials
import utils

endpoint = f'{utils.api_root}/auth/'

def test_create_session():
    credentials = UserCredentials(
        username='test@test.test',
        password='password'
    )
    response = utils.session.post(endpoint, json=credentials.dict())
    SessionEncoded.parse_obj(response.json())