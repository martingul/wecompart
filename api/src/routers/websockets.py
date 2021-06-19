from typing import List
from fastapi import APIRouter, WebSocket, Depends
from starlette.websockets import WebSocketDisconnect

from schemas.session import Session
from lib import auth, websockets

router = APIRouter()

@router.websocket('/')
async def websocket_endpoint(websocket: WebSocket,
    session: Session = Depends(auth.auth_session)):
    conn = websockets.Connection(websocket, session.user_uuid)
    await websockets.manager.connect(conn)
    try:
        while True:
            data = await conn.websocket.receive_text()
    except WebSocketDisconnect:
        websockets.manager.disconnect(conn)
