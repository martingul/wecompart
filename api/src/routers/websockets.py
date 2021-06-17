from fastapi import APIRouter, WebSocket, Depends

from schemas.session import Session
from lib import auth

router = APIRouter()

@router.websocket('/')
async def websocket_endpoint(websocket: WebSocket,
    session: Session = Depends(auth.auth_session)):
    print(session)
    print('Awaiting client connection...')
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(data)