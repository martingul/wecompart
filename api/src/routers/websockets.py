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
    print(f'\n{conn.user_uuid} websocket connected\n')
    await websockets.manager.connect(conn)
    # await websockets.manager.broadcast(f'user {session.user_uuid} connected', ignore=[conn])
    try:
        while True:
            data = await conn.websocket.receive_text()
            print(data)
    #         await websockets.manager.send_message(conn, f'you wrote: {data}')
    #         await websockets.manager.broadcast(f'user {session.user_uuid} says {data}', ignore=[conn])
    except WebSocketDisconnect:
        print(f'\n{conn.user_uuid} websocket disconnected\n')
        websockets.manager.disconnect(conn)
        # await websockets.manager.broadcast(f'user {session.user_uuid} disconnected')
