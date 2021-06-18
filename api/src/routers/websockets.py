from typing import List
from fastapi import APIRouter, WebSocket, Depends
from starlette.websockets import WebSocketDisconnect

from schemas.session import Session
from lib import auth

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, websocket: WebSocket, message: str):
        await websocket.send_text(message)

    async def broadcast(self, message: str, ignore: List[WebSocket] = None):
        connections = self.active_connections
        if ignore:
            connections = [c for c in connections if c not in ignore]
        for connection in connections:
            await connection.send_text(message)

router = APIRouter()
manager = ConnectionManager()

@router.websocket('/')
async def websocket_endpoint(websocket: WebSocket,
    session: Session = Depends(auth.auth_session)):
    await manager.connect(websocket)
    await manager.broadcast(f'user {session.user_uuid} connected', ignore=[websocket])
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(websocket, f'you wrote: {data}')
            await manager.broadcast(f'user {session.user_uuid} says {data}', ignore=[websocket])
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f'user {session.user_uuid} disconnected')
