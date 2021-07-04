from typing import List
from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect

class Connection:
    def __init__(self, websocket: WebSocket, user_uuid: str):
        self.websocket = websocket
        self.user_uuid = user_uuid

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Connection] = []

    async def connect(self, conn: Connection):
        await conn.websocket.accept()
        self.active_connections.append(conn)

    def disconnect(self, conn: Connection):
        self.active_connections.remove(conn)
    
    def get_connection(self, user_uuid: str):
        return [c for c in self.active_connections if c.user_uuid == user_uuid]

    async def send_message(self, conn: Connection, content: str):
        try:
            await conn.websocket.send_text(content)
        except WebSocketDisconnect:
            self.disconnect(conn)

    async def broadcast(self, message: str, ignore: List[Connection] = None):
        connections = self.active_connections
        if ignore:
            connections = [c for c in connections if c not in ignore]
        for c in connections:
            try:
                await c.websocket.send_text(message)
            except WebSocketDisconnect:
                self.disconnect(c)

websocket_manager = ConnectionManager()