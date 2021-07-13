from fastapi import APIRouter, Depends

from schemas.session import Session
from lib import auth, locations

router = APIRouter()

@router.get('/')
def read_locations(
    q: str,
    session: Session = Depends(auth.auth_session)
):
    # TODO validate query
    return locations.read_locations(q)

@router.get('/{location_id}')
def read_location(
    location_id: str,
    session: Session = Depends(auth.auth_session)
):
    # TODO validate query
    return locations.read_location(location_id)